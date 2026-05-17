import React from 'react';
import { 
  Cloud, 
  Droplets, 
  Thermometer, 
  Wind, 
  Loader2,
  Sun,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSun 
} from 'lucide-react';
import useWeather from '../hooks/useWeather';

const WeatherWidget = ({ regionId }) => {
  const { currentWeather, isLoading, error } = useWeather(regionId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-800/20 rounded-2xl border border-gray-700/20 h-24 animate-pulse">
        <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
      </div>
    );
  }

  if (error || !currentWeather) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-800/20 rounded-2xl border border-gray-700/20">
        <div className="flex items-center gap-3 opacity-50">
          <div className="p-2 bg-gray-800 rounded-lg">
            <Cloud className="text-gray-500" size={16} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Weather Forecast</p>
            <p className="text-xs text-gray-600 font-medium">Data unavailable</p>
          </div>
        </div>
      </div>
    );
  }

  const getIcon = (condition) => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('rain') || cond.includes('hujan')) {
      return <CloudRain className="text-blue-400 animate-bounce" size={24} style={{ animationDuration: '2s' }} />;
    }
    if (cond.includes('drizzle') || cond.includes('gerimis')) {
      return <CloudDrizzle className="text-sky-300" size={24} />;
    }
    if (cond.includes('thunderstorm') || cond.includes('badai') || cond.includes('petir')) {
      return <CloudLightning className="text-amber-500 animate-pulse" size={24} />;
    }
    if (cond.includes('clear') || cond.includes('sunny') || cond.includes('cerah')) {
      return <Sun className="text-amber-400 animate-spin" size={24} style={{ animationDuration: '10s' }} />;
    }
    if (cond.includes('cloud') || cond.includes('awan') || cond.includes('berawan')) {
      if (cond.includes('partly') || cond.includes('sebagian')) {
        return <CloudSun className="text-gray-300" size={24} />;
      }
      return <Cloud className="text-slate-400" size={24} />;
    }
    if (cond.includes('wind') || cond.includes('angin') || cond.includes('berangin')) {
      return <Wind className="text-teal-400" size={24} />;
    }
    return <Cloud className="text-emerald-400" size={24} />;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl border border-gray-700/30 hover:border-gray-600/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-gray-800/80 rounded-xl border border-gray-700/50 shadow-inner">
          {getIcon(currentWeather.weather_condition)}
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80 mb-0.5">Today's Weather</p>
          <div className="flex flex-col">
            <p className="text-lg font-black text-white leading-none">
              {currentWeather.weather_condition}
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">
              {new Date(currentWeather.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="p-1.5 bg-rose-500/10 rounded-lg">
            <Thermometer size={14} className="text-rose-400" />
          </div>
          <p className="text-xs font-bold text-gray-300">{Math.round(currentWeather.temperature)}°C</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <Droplets size={14} className="text-blue-400" />
          </div>
          <p className="text-xs font-bold text-gray-300">{currentWeather.humidity}%</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
