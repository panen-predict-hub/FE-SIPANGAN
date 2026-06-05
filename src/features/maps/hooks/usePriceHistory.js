import { useState, useCallback } from 'react';
import { priceService, predictionService } from '../../../api/services';


const usePriceHistory = () => {
  const [regionPrices, setRegionPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPriceHistory = useCallback(async (regionName, commodity, currentPriceData = null, limit = 12) => {
    if (!regionName) return;

    try {
      setIsLoading(true);
      setError(null);

      const apiRegionName = regionName.trim();
      const apiCommodityName = commodity.trim();

      // Fetch both history and prediction in parallel
      const [historyResponse, predictionResponse] = await Promise.all([
        priceService.getHistory({ commodity: apiCommodityName, region: apiRegionName, limit }),
        predictionService.getPrediction(apiCommodityName, apiRegionName).catch(() => null)
      ]);

      // Process History
      const histData = historyResponse?.data || historyResponse || [];
      const priceList = Array.isArray(histData) ? histData : [];
      
      // Map and sanitize history points
      let processedHistory = priceList.map(d => ({
        ...d,
        price: d.price || d.harga || d.current_price || d.value,
        date: d.date || d.created_at || d.tanggal
      })).filter(d => d.price && d.date);

      // Group history by month (YYYY-MM) to ensure only one data point per month (on the 1st)
      const monthlyGroups = {};
      processedHistory.forEach(d => {
        const dateObj = new Date(d.date);
        const yearMonth = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
        // Keep the latest record of each month
        if (!monthlyGroups[yearMonth] || new Date(d.date) > new Date(monthlyGroups[yearMonth].date)) {
          monthlyGroups[yearMonth] = d;
        }
      });

      // Map back to array, setting the date to the 1st of that month
      let monthlyHistory = Object.keys(monthlyGroups).map(yearMonth => {
        const originalData = monthlyGroups[yearMonth];
        const [year, month] = yearMonth.split('-').map(Number);
        // Normalize date to the 1st of the month at midday (to prevent timezone shift issues)
        const normalizedDate = new Date(year, month - 1, 1, 12, 0, 0);
        return {
          ...originalData,
          date: normalizedDate.toISOString()
        };
      });

      // Sort ascending for the chart
      let sortedData = [...monthlyHistory]
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      // Slice to take only the latest 'limit' number of months
      if (sortedData.length > limit) {
        sortedData = sortedData.slice(-limit);
      }


      // FALLBACK: If history is empty but we have currentPriceData from overview
      const fallbackPrice = currentPriceData?.price || currentPriceData?.harga || currentPriceData?.current_price;
      if (sortedData.length === 0 && fallbackPrice) {
        const normalizedDate = new Date();
        normalizedDate.setDate(1); // Set to 1st of current month
        normalizedDate.setHours(12, 0, 0, 0);
        sortedData = [{
          date: normalizedDate.toISOString(),
          price: fallbackPrice,
          actualPrice: fallbackPrice,
          region: regionName,
          commodity: commodity
        }];
      }

      // Process Prediction
      const predData = predictionResponse?.data || predictionResponse;

      if (sortedData.length > 0) {
        const lastActual = sortedData[sortedData.length - 1];
        const lastDate = new Date(lastActual.date);

        let predictionPoints = [];

        // Support both direct object and the { predictions: [] } format from backend
        const predictionsArray = predData?.predictions || (Array.isArray(predData) ? predData : (predData ? [predData] : []));
        
        if (predictionsArray.length > 0) {
          // Limit to exactly 1 prediction point (1 month ahead)
          const firstPred = predictionsArray[0];
          const predDate = new Date(lastDate);
          predDate.setMonth(lastDate.getMonth() + 1);
          predDate.setDate(1);
          predDate.setHours(12, 0, 0, 0);

          predictionPoints = [{
            ...lastActual,
            date: predDate.toISOString(),
            price: firstPred.price || firstPred.predictedPrice || firstPred.harga_prediksi,
            isPrediction: true
          }];
        }

        const actualData = sortedData.map(d => ({ ...d, actualPrice: d.price || d.actualPrice, predictedPrice: null }));
        const predictionData = predictionPoints.map(d => ({ ...d, actualPrice: null, predictedPrice: d.price }));
        const bridgePoint = { ...lastActual, actualPrice: lastActual.price || fallbackPrice, predictedPrice: lastActual.price || fallbackPrice };

        setRegionPrices([...actualData.slice(0, -1), bridgePoint, ...predictionData]);
      } else {
        setRegionPrices([]);
      }
    } catch (err) {
      console.error('Failed to fetch region prices:', err);
      
      // Even on Error, try to show the current price from overview
      const fallbackPrice = currentPriceData?.price || currentPriceData?.harga || currentPriceData?.current_price;
      if (fallbackPrice) {
        const singlePoint = {
          date: new Date().toISOString(),
          price: fallbackPrice,
          actualPrice: fallbackPrice,
          predictedPrice: fallbackPrice,
          region: regionName
        };
        setRegionPrices([singlePoint]);
      } else {
        setError('Failed to load price history');
        setRegionPrices([]);
      }
    } finally {
      setIsLoading(false);
    }

  }, []);


  return { regionPrices, isLoading, error, fetchPriceHistory, setRegionPrices };
};

export default usePriceHistory;
