import React from 'react';
import { 
  Thermometer, Droplets, TrendingDown,
  Sun, CloudRain, CloudDrizzle, CloudLightning, CloudSun, Cloud, Wind 
} from 'lucide-react';

const CompareMetrics = ({
  regionA,
  regionB,
  weatherA,
  weatherB,
  priceDiff,
  selectedCommodity
}) => {
  
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

  return (
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
      
    </div>
  );
};

export default CompareMetrics;
