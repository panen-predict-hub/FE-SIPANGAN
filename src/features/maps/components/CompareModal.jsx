import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitCompare } from 'lucide-react';
import { priceService, weatherService } from '../../../api/services';
import CompareSelector from './compare/CompareSelector';
import CompareMetrics from './compare/CompareMetrics';
import CompareChart from './compare/CompareChart';

const CompareModal = ({ isOpen, onClose, regionList, selectedCommodity }) => {
  const [regionA, setRegionA] = useState(null);
  const [regionB, setRegionB] = useState(null);
  
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [isOpenA, setIsOpenA] = useState(false);
  const [isOpenB, setIsOpenB] = useState(false);

  const [chartData, setChartData] = useState([]);
  const [weatherA, setWeatherA] = useState(null);
  const [weatherB, setWeatherB] = useState(null);

  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  // Filter regions based on search
  const filteredListA = useMemo(() => {
    return regionList.filter(r => 
      r.name.toLowerCase().includes(searchA.toLowerCase()) && 
      (!regionB || r.name !== regionB.name)
    );
  }, [regionList, searchA, regionB]);

  const filteredListB = useMemo(() => {
    return regionList.filter(r => 
      r.name.toLowerCase().includes(searchB.toLowerCase()) && 
      (!regionA || r.name !== regionA.name)
    );
  }, [regionList, searchB, regionA]);

  // Parallel Fetching
  const fetchData = useCallback(async () => {
    if (!regionA || !regionB) return;

    try {
      setIsFetching(true);
      setError(null);
      setChartData([]);
      setWeatherA(null);
      setWeatherB(null);

      const [histAResp, histBResp, weatherAResp, weatherBResp] = await Promise.all([
        priceService.getHistory({ commodity: selectedCommodity, region: regionA.name, limit: 12 }),
        priceService.getHistory({ commodity: selectedCommodity, region: regionB.name, limit: 12 }),
        regionA.regionId ? weatherService.getWeatherByRegion(regionA.regionId).catch(() => null) : Promise.resolve(null),
        regionB.regionId ? weatherService.getWeatherByRegion(regionB.regionId).catch(() => null) : Promise.resolve(null)
      ]);

      // Process History A
      const rawA = histAResp?.data || histAResp || [];
      const listA = Array.isArray(rawA) ? rawA : [];
      const processedA = listA.map(d => ({
        price: d.price || d.harga || d.current_price || d.value,
        date: d.date || d.created_at || d.tanggal
      })).filter(d => d.price && d.date);

      // Process History B
      const rawB = histBResp?.data || histBResp || [];
      const listB = Array.isArray(rawB) ? rawB : [];
      const processedB = listB.map(d => ({
        price: d.price || d.harga || d.current_price || d.value,
        date: d.date || d.created_at || d.tanggal
      })).filter(d => d.price && d.date);

      // Fallback if histories empty but we have current prices
      let finalA = [...processedA];
      if (finalA.length === 0 && regionA.price > 0) {
        finalA = [{ date: new Date().toISOString(), price: regionA.price }];
      }

      let finalB = [...processedB];
      if (finalB.length === 0 && regionB.price > 0) {
        finalB = [{ date: new Date().toISOString(), price: regionB.price }];
      }

      // Merge timelines by month/year
      const dateMap = {};

      finalA.forEach(item => {
        const d = new Date(item.date);
        const key = d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
        if (!dateMap[key]) dateMap[key] = { key, timestamp: d.getTime() };
        dateMap[key].priceA = item.price;
      });

      finalB.forEach(item => {
        const d = new Date(item.date);
        const key = d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
        if (!dateMap[key]) dateMap[key] = { key, timestamp: d.getTime() };
        dateMap[key].priceB = item.price;
      });

      const merged = Object.values(dateMap)
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(item => ({
          dateLabel: item.key,
          [regionA.name]: item.priceA || null,
          [regionB.name]: item.priceB || null
        }));

      setChartData(merged);

      // Weather mapping
      const wDataA = weatherAResp?.data?.data?.weather || weatherAResp?.data?.weather || weatherAResp?.data || [];
      setWeatherA(Array.isArray(wDataA) && wDataA.length > 0 ? wDataA[0] : null);

      const wDataB = weatherBResp?.data?.data?.weather || weatherBResp?.data?.weather || weatherBResp?.data || [];
      setWeatherB(Array.isArray(wDataB) && wDataB.length > 0 ? wDataB[0] : null);

    } catch (err) {
      console.error('Failed to load comparison data:', err);
      setError('Gagal memuat data perbandingan historis.');
    } finally {
      setIsFetching(false);
    }
  }, [regionA, regionB, selectedCommodity]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate Price Difference
  const priceDiff = useMemo(() => {
    if (!regionA || !regionB) return null;
    const priceA = regionA.price || 0;
    const priceB = regionB.price || 0;
    
    if (priceA === 0 || priceB === 0) return null;

    const diff = Math.abs(priceA - priceB);
    const maxVal = Math.max(priceA, priceB);
    const percent = maxVal > 0 ? (diff / maxVal) * 100 : 0;
    const cheaperRegion = priceA < priceB ? regionA.name : regionB.name;
    const expensiveRegion = priceA > priceB ? regionA.name : regionB.name;
    const isSame = priceA === priceB;

    return {
      diff,
      percent: percent.toFixed(1),
      cheaperRegion,
      expensiveRegion,
      isSame
    };
  }, [regionA, regionB]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="relative max-w-5xl w-full bg-gray-950/90 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col h-[90vh] overflow-hidden"
        >
          {/* Subtle Glows */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-gray-800/50 pb-5 mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <GitCompare size={22} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">Perbandingan Harga Wilayah</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                  Bandingkan kestabilan pasar & cuaca di Jawa Timur
                </p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="p-3 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded-2xl border border-gray-800 hover:border-gray-700 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-1 space-y-6">
            
            {/* Selection Inputs Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
              <CompareSelector
                label="Wilayah Pembanding A"
                region={regionA}
                isOpen={isOpenA}
                onToggle={() => setIsOpenA(!isOpenA)}
                search={searchA}
                onSearchChange={setSearchA}
                filteredList={filteredListA}
                onSelect={(r) => {
                  setRegionA(r);
                  setIsOpenA(false);
                  setSearchA('');
                }}
                theme="emerald"
              />

              <CompareSelector
                label="Wilayah Pembanding B"
                region={regionB}
                isOpen={isOpenB}
                onToggle={() => setIsOpenB(!isOpenB)}
                search={searchB}
                onSearchChange={setSearchB}
                filteredList={filteredListB}
                onSelect={(r) => {
                  setRegionB(r);
                  setIsOpenB(false);
                  setSearchB('');
                }}
                theme="indigo"
              />
            </div>

            {/* Comparison Metrics Panel */}
            {regionA && regionB ? (
              <div className="space-y-6">
                <CompareMetrics
                  regionA={regionA}
                  regionB={regionB}
                  weatherA={weatherA}
                  weatherB={weatherB}
                  priceDiff={priceDiff}
                  selectedCommodity={selectedCommodity}
                />

                <CompareChart
                  chartData={chartData}
                  isFetching={isFetching}
                  selectedCommodity={selectedCommodity}
                  regionA={regionA}
                  regionB={regionB}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4 py-20 animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-gray-900/80 rounded-full flex items-center justify-center border border-gray-800 shadow-2xl relative">
                  <GitCompare className="text-gray-500" size={36} />
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-gray-900 animate-ping" />
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-gray-900" />
                </div>
                <div>
                  <h4 className="text-white font-black uppercase tracking-widest text-xs mb-2">Mulai Perbandingan Wilayah</h4>
                  <p className="text-gray-500 text-[11px] font-medium leading-relaxed max-w-sm mx-auto">
                    Silakan pilih dua kabupaten/kota berbeda pada dropdown di atas untuk memulai analisis disparitas harga, perbandingan ramalan cuaca, serta tren historis side-by-side.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-gray-800/50 bg-gray-950/80 mt-6 shrink-0 rounded-2xl flex justify-center gap-6 sm:gap-12">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Wilayah A (Gradasi Hijau)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Wilayah B (Gradasi Violet)</span>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareModal;
