import { X, TrendingUp, TrendingDown, ArrowRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WeatherWidget from './WeatherWidget';
import PriceSidebarSkeleton from './sidebar/PriceSidebarSkeleton';
import PriceSidebarChart from './sidebar/PriceSidebarChart';

const PriceSidebar = ({ region, regionId, status, currentPrice, trend, prices, isLoading, selectedRange, onRangeChange, onClose }) => {
  if (!region) return null;

  const isNoData = status?.toLowerCase() === 'tanpa_data' || currentPrice === 0;

  const getStatusColor = (s) => {
    switch (s?.toLowerCase()) {
      case 'aman':
      case 'stabil': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' };
      case 'waspada': return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' };
      case 'kritis':
      case 'bahaya': return { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20' };
      case 'tanpa_data': return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' };
      default: return { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' };
    }
  };

  const statusStyle = getStatusColor(status);

  const actualPrices = prices.filter(p => !p.isPrediction);
  const latestActual = actualPrices[actualPrices.length - 1];
  const previousActual = actualPrices[actualPrices.length - 2];
  
  const priceFromHistory = latestActual ? latestActual.price : 0;
  
  const calculatedTrend = (() => {
    if (trend) return trend;
    if (!latestActual || !previousActual) return 'stable';
    const diff = latestActual.price - previousActual.price;
    if (Math.abs(diff) < 100) return 'stable';
    return diff > 0 ? 'up' : 'down';
  })();

  const firstPrediction = prices.find(p => p.isPrediction);
  const predictedPrice = firstPrediction ? firstPrediction.price : 0;

  return (
    <div className="w-full lg:w-[450px] bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out overflow-hidden h-full">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-gray-800/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-white/10">
              Region Analytics
            </span>
            <span className={`px-2 py-0.5 ${statusStyle.bg} ${statusStyle.text} text-[9px] font-black uppercase tracking-widest rounded-md border ${statusStyle.border} animate-pulse`}>
              Status: {status === 'tanpa_data' ? 'Tanpa Data' : (status || 'Normal')}
            </span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{region}</h3>
        </div>

        <button 
          onClick={onClose}
          className="p-3 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-2xl transition-all border border-gray-700/50 hover:border-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
        {/* Stats Grid - Stable layout to prevent flicker */}
        <div className={`grid grid-cols-1 ${predictedPrice > 0 || isLoading ? 'sm:grid-cols-2' : 'sm:grid-cols-1'} gap-4`}>
          <div className={`p-5 bg-gray-800/20 rounded-2xl border border-gray-700/20 hover:border-emerald-500/30 transition-colors duration-300 ${isLoading ? 'animate-pulse' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Current Price</p>
              <div className={`p-1.5 ${isNoData ? 'bg-slate-500/10' : calculatedTrend === 'up' ? 'bg-red-500/10' : calculatedTrend === 'down' ? 'bg-emerald-500/10' : 'bg-blue-500/10'} rounded-lg`}>
                {isNoData ? <ArrowRight size={14} className="text-slate-500" /> :
                 calculatedTrend === 'up' ? <TrendingUp size={14} className="text-red-500" /> : 
                 calculatedTrend === 'down' ? <TrendingDown size={14} className="text-emerald-500" /> : 
                 <ArrowRight size={14} className="text-blue-500" />}
              </div>
            </div>
            <p className="text-2xl font-black text-white">
              {isNoData ? (
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Belum Terdata</span>
              ) : (
                <>
                  <span className="text-xs text-emerald-500 mr-1">Rp</span>
                  {new Intl.NumberFormat('id-ID').format(priceFromHistory || currentPrice || 0)}
                </>
              )}
            </p>
          </div>

          {/* Show Forecasted Price or Shimmers / Skeletons if loading */}
          {isLoading ? (
            <div className="p-5 bg-gray-800/10 rounded-2xl border border-gray-700/15 animate-pulse flex flex-col justify-between h-[104px] transition-all duration-300">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-500/60 uppercase font-black tracking-widest">Forecasted Price</p>
                <div className="w-7 h-7 bg-gray-800/50 rounded-lg"></div>
              </div>
              <div className="h-6 w-28 bg-gray-800 rounded-md"></div>
              <div className="h-3 w-20 bg-gray-800/50 rounded-md"></div>
            </div>
          ) : predictedPrice > 0 ? (
            <div className="p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10 transition-colors duration-300 animate-in fade-in zoom-in duration-500">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] text-amber-500/60 uppercase font-black tracking-widest">Forecasted Price</p>
                <div className="p-1.5 bg-amber-500/10 rounded-lg">
                  <TrendingUp size={14} className="text-amber-500" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-white">
                  <span className="text-xs text-amber-500 mr-1">Rp</span>
                  {new Intl.NumberFormat('id-ID').format(predictedPrice)}
                </p>
                {(currentPrice || priceFromHistory) > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${predictedPrice >= (currentPrice || priceFromHistory) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {predictedPrice >= (currentPrice || priceFromHistory) ? '+' : ''}{((predictedPrice - (currentPrice || priceFromHistory)) / (currentPrice || priceFromHistory) * 100).toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Next Month Estimate</p>
            </div>
          ) : null}
        </div>

        {regionId && <WeatherWidget regionId={regionId} />}

        <AnimatePresence mode="wait">
          {isLoading && prices.length === 0 ? (
            <PriceSidebarSkeleton />
          ) : (prices.length > 0 && !isNoData) ? (
            <PriceSidebarChart
              prices={prices}
              isLoading={isLoading}
              selectedRange={selectedRange}
              onRangeChange={onRangeChange}
            />
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full flex flex-col items-center justify-center text-center p-10 space-y-4 py-16"
            >
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-700/50 shadow-lg">
                <Calendar className="text-gray-500" size={32} />
              </div>
              <div>
                <p className="text-white font-black uppercase tracking-widest text-xs mb-2">Tidak Ada Data Historis</p>
                <p className="text-gray-500 text-[11px] font-medium leading-relaxed max-w-xs mx-auto">
                  Belum ada catatan riwayat harga komoditas yang terdata untuk wilayah ini. Silakan pilih wilayah atau komoditas lain.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Footer / Legend */}
      <div className="p-6 border-t border-gray-800/50 bg-gray-900/50 flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-emerald-500 rounded-full"></div>
          <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Historical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-amber-500 rounded-full opacity-50"></div>
          <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Forecast</span>
        </div>
      </div>
    </div>
  );
};

export default PriceSidebar;
