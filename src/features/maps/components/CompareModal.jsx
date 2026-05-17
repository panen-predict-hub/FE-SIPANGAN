import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, GitCompare, ChevronDown, Search, TrendingUp, TrendingDown, 
  Info, Calendar, MapPin, Thermometer, Droplets, ArrowRight,
  Sun, CloudRain, CloudDrizzle, CloudLightning, CloudSun, Cloud, Wind, Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Area, Legend 
} from 'recharts';
import { priceService, weatherService } from '../../../api/services';

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

  // Weather Icon Mapper
  const getWeatherIcon = (condition) => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('rain') || cond.includes('hujan')) {
      return <CloudRain className="text-blue-400 animate-bounce" size={20} style={{ animationDuration: '2s' }} />;
    }
    if (cond.includes('drizzle') || cond.includes('gerimis')) {
      return <CloudDrizzle className="text-sky-300" size={20} />;
    }
    if (cond.includes('thunderstorm') || cond.includes('badai') || cond.includes('petir')) {
      return <CloudLightning className="text-amber-500 animate-pulse" size={20} />;
    }
    if (cond.includes('clear') || cond.includes('sunny') || cond.includes('cerah')) {
      return <Sun className="text-amber-400 animate-spin" size={20} style={{ animationDuration: '10s' }} />;
    }
    if (cond.includes('cloud') || cond.includes('awan') || cond.includes('berawan')) {
      if (cond.includes('partly') || cond.includes('sebagian')) {
        return <CloudSun className="text-gray-300" size={20} />;
      }
      return <Cloud className="text-slate-400" size={20} />;
    }
    if (cond.includes('wind') || cond.includes('angin') || cond.includes('berangin')) {
      return <Wind className="text-teal-400" size={20} />;
    }
    return <Cloud className="text-emerald-400" size={20} />;
  };

  // Status Style Mapper
  const getStatusStyle = (s) => {
    switch (s?.toLowerCase()) {
      case 'aman':
      case 'stabil': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'waspada': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'kritis':
      case 'bahaya': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'tanpa_data': return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

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
      const curWeatherA = Array.isArray(wDataA) && wDataA.length > 0 ? wDataA[0] : null;
      setWeatherA(curWeatherA);

      const wDataB = weatherBResp?.data?.data?.weather || weatherBResp?.data?.weather || weatherBResp?.data || [];
      const curWeatherB = Array.isArray(wDataB) && wDataB.length > 0 ? wDataB[0] : null;
      setWeatherB(curWeatherB);

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
              
              {/* Region Selector A */}
              <div className="relative">
                <label className="text-[9px] text-emerald-500 font-black uppercase tracking-widest block mb-2">Wilayah Pembanding A</label>
                <div 
                  onClick={() => setIsOpenA(!isOpenA)}
                  className="w-full bg-gray-900/50 border border-gray-800/80 hover:border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all text-white"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="text-emerald-500" size={18} />
                    <span className="text-sm font-bold">{regionA ? regionA.name : 'Pilih Wilayah A'}</span>
                  </div>
                  <ChevronDown className={`text-gray-500 transition-transform ${isOpenA ? 'rotate-180' : ''}`} size={16} />
                </div>

                <AnimatePresence>
                  {isOpenA && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 mt-2 z-50 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-3 max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-2"
                    >
                      <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input 
                          type="text"
                          placeholder="Cari wilayah..."
                          value={searchA}
                          onChange={(e) => setSearchA(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-500/50"
                        />
                      </div>
                      <div className="space-y-1 overflow-y-auto max-h-40">
                        {filteredListA.length > 0 ? (
                          filteredListA.map(r => (
                            <button
                              key={r.name}
                              onClick={() => {
                                setRegionA(r);
                                setIsOpenA(false);
                                setSearchA('');
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all font-semibold flex items-center justify-between"
                            >
                              <span>{r.name}</span>
                              <span className="text-[9px] font-black uppercase text-gray-500">Rp {new Intl.NumberFormat('id-ID').format(r.price || 0)}</span>
                            </button>
                          ))
                        ) : (
                          <p className="text-[10px] text-gray-600 font-bold uppercase text-center py-4">Wilayah tidak ditemukan</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Region Selector B */}
              <div className="relative">
                <label className="text-[9px] text-indigo-400 font-black uppercase tracking-widest block mb-2">Wilayah Pembanding B</label>
                <div 
                  onClick={() => setIsOpenB(!isOpenB)}
                  className="w-full bg-gray-900/50 border border-gray-800/80 hover:border-indigo-500/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all text-white"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="text-indigo-400" size={18} />
                    <span className="text-sm font-bold">{regionB ? regionB.name : 'Pilih Wilayah B'}</span>
                  </div>
                  <ChevronDown className={`text-gray-500 transition-transform ${isOpenB ? 'rotate-180' : ''}`} size={16} />
                </div>

                <AnimatePresence>
                  {isOpenB && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 mt-2 z-50 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-3 max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-2"
                    >
                      <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input 
                          type="text"
                          placeholder="Cari wilayah..."
                          value={searchB}
                          onChange={(e) => setSearchB(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-1 overflow-y-auto max-h-40">
                        {filteredListB.length > 0 ? (
                          filteredListB.map(r => (
                            <button
                              key={r.name}
                              onClick={() => {
                                setRegionB(r);
                                setIsOpenB(false);
                                setSearchB('');
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all font-semibold flex items-center justify-between"
                            >
                              <span>{r.name}</span>
                              <span className="text-[9px] font-black uppercase text-gray-500">Rp {new Intl.NumberFormat('id-ID').format(r.price || 0)}</span>
                            </button>
                          ))
                        ) : (
                          <p className="text-[10px] text-gray-600 font-bold uppercase text-center py-4">Wilayah tidak ditemukan</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Comparison Metrics Panel */}
            {regionA && regionB ? (
              <div className="space-y-6">
                
                {/* Side by Side current price & weather */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Card Region A */}
                  <div className="bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/20 transition-all rounded-3xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-black text-white">{regionA.name}</h4>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getStatusStyle(regionA.status)}`}>
                          {regionA.status === 'tanpa_data' ? 'Tanpa Data' : (regionA.status || 'NORMAL')}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Harga Terkini</p>
                        <p className="text-3xl font-black text-white">
                          {regionA.price > 0 ? (
                            <>
                              <span className="text-xs text-emerald-500 mr-1">Rp</span>
                              {new Intl.NumberFormat('id-ID').format(regionA.price)}
                              <span className="text-xs text-gray-500 font-semibold">/kg</span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Belum Terdata</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Weather Info A */}
                    {weatherA && (
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-2xl border border-gray-800/50">
                        <div className="flex items-center gap-3">
                          {getWeatherIcon(weatherA.weather_condition)}
                          <div>
                            <p className="text-[8px] text-emerald-500/80 font-black uppercase tracking-widest">Cuaca Hari Ini</p>
                            <p className="text-xs font-bold text-white">{weatherA.weather_condition}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-1">
                            <Thermometer size={14} className="text-rose-400" />
                            <span className="text-xs font-bold text-gray-300">{Math.round(weatherA.temperature)}°C</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Droplets size={14} className="text-blue-400" />
                            <span className="text-xs font-bold text-gray-300">{weatherA.humidity}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Region B */}
                  <div className="bg-indigo-500/5 border border-indigo-500/10 hover:border-indigo-500/20 transition-all rounded-3xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-black text-white">{regionB.name}</h4>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getStatusStyle(regionB.status)}`}>
                          {regionB.status === 'tanpa_data' ? 'Tanpa Data' : (regionB.status || 'NORMAL')}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Harga Terkini</p>
                        <p className="text-3xl font-black text-white">
                          {regionB.price > 0 ? (
                            <>
                              <span className="text-xs text-indigo-400 mr-1">Rp</span>
                              {new Intl.NumberFormat('id-ID').format(regionB.price)}
                              <span className="text-xs text-gray-500 font-semibold">/kg</span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Belum Terdata</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Weather Info B */}
                    {weatherB && (
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-2xl border border-gray-800/50">
                        <div className="flex items-center gap-3">
                          {getWeatherIcon(weatherB.weather_condition)}
                          <div>
                            <p className="text-[8px] text-indigo-400/80 font-black uppercase tracking-widest">Cuaca Hari Ini</p>
                            <p className="text-xs font-bold text-white">{weatherB.weather_condition}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-1">
                            <Thermometer size={14} className="text-rose-400" />
                            <span className="text-xs font-bold text-gray-300">{Math.round(weatherB.temperature)}°C</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Droplets size={14} className="text-blue-400" />
                            <span className="text-xs font-bold text-gray-300">{weatherB.humidity}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Direct Delta Comparison Box */}
                {priceDiff && (
                  <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-4 animate-in fade-in zoom-in duration-500">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
                      <TrendingDown className="animate-bounce" size={24} style={{ animationDuration: '2s' }} />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-emerald-400 mb-0.5">Analisis Selisih Harga</h5>
                      {priceDiff.isSame ? (
                        <p className="text-xs text-gray-400">Harga komoditas <strong>{selectedCommodity}</strong> di kedua wilayah sama rata.</p>
                      ) : (
                        <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                          Harga pangan di <strong>{priceDiff.cheaperRegion}</strong> terpantau lebih hemat sebesar <span className="text-emerald-400 font-black">Rp {new Intl.NumberFormat('id-ID').format(priceDiff.diff)}/kg</span> (<span className="text-emerald-400 font-black">{priceDiff.percent}%</span>) dibandingkan dengan wilayah <strong>{priceDiff.expensiveRegion}</strong>.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Comparison Chart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-500" />
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Tren Perbandingan 12 Bulan Terakhir ({selectedCommodity})
                    </h4>
                  </div>

                  <div className="relative group">
                    {/* Loading Overlay */}
                    <AnimatePresence>
                      {isFetching && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-10 bg-gray-950/20 backdrop-blur-[2px] rounded-3xl flex items-center justify-center border border-emerald-500/10"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">Memuat Grafik</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="h-[250px] sm:h-[300px] w-full bg-gray-900/20 border border-gray-800 rounded-3xl p-4 transition-all duration-300 relative">
                      {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                            <XAxis 
                              dataKey="dateLabel" 
                              stroke="#475569" 
                              fontSize={10} 
                              fontWeight="bold"
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis 
                              stroke="#475569" 
                              fontSize={10} 
                              fontWeight="bold"
                              axisLine={false}
                              tickLine={false}
                              tickFormatter={(val) => `${val/1000}k`}
                            />
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '12px' }}
                              itemStyle={{ fontWeight: '900', fontSize: '12px' }}
                              labelStyle={{ color: '#64748b', marginBottom: '4px', fontWeight: 'bold', fontSize: '10px' }}
                              formatter={(value) => [`Rp ${new Intl.NumberFormat('id-ID').format(value)}/kg`]}
                            />
                            <Legend 
                              verticalAlign="top" 
                              height={36} 
                              iconType="circle"
                              iconSize={8}
                              wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }} 
                            />
                            <Area 
                              type="monotone" 
                              dataKey={regionA.name} 
                              stroke="#10b981" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorA)" 
                            />
                            <Area 
                              type="monotone" 
                              dataKey={regionB.name} 
                              stroke="#8b5cf6" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorB)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                          <Calendar className="text-gray-600" size={32} />
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Tidak ada data historis yang tersedia</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

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
