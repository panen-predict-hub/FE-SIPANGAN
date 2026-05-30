import React from 'react';
import { TrendingUp, Map as MapIcon, Package, HelpCircle, GitCompare } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';

const MapHeader = ({ selectedCommodity, onCommodityChange, commodities = [], onOpenGuide, onOpenCompare }) => {
  const commodityOptions = React.useMemo(() => {
    if (commodities.length === 0) {
      return [{ label: "Beras Medium", value: "Beras Medium" }];
    }
    
    // Map commodities to selector option format
    const mapped = commodities.map(c => ({ label: c.name, value: c.name }));
    
    // Find 'Beras Medium' and bubble it to the first position
    const index = mapped.findIndex(c => c.value.toLowerCase() === 'beras medium');
    if (index > -1) {
      const [berasMedium] = mapped.splice(index, 1);
      return [berasMedium, ...mapped];
    }
    
    return mapped;
  }, [commodities]);

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between bg-gray-900/60 backdrop-blur-xl p-3 sm:p-4 border border-gray-800/50 rounded-2xl shadow-2xl gap-3 sm:gap-4 relative z-[1001]">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="p-2 sm:p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <MapIcon className="text-emerald-400" size={18} />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            SIPANGAN <span className="text-emerald-500">Monitor</span>
          </h2>
          <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Geospatial Insights • East Java
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
        <div className="flex-1 lg:flex-initial flex items-center gap-2">
          <div className="w-full lg:w-64">
            <CustomDropdown
              value={selectedCommodity}
              onChange={onCommodityChange}
              options={commodityOptions}
              placeholder="Select Commodity"
              icon={Package}
            />
          </div>
        </div>

        <button
          onClick={onOpenCompare}
          className="flex items-center justify-center gap-2 h-[42px] w-[42px] sm:w-auto px-0 sm:px-4 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.05)] shrink-0"
          title="Bandingkan Dua Wilayah"
        >
          <GitCompare size={15} />
          <span className="hidden sm:inline">Bandingkan</span>
        </button>

        <button
          onClick={onOpenGuide}
          className="flex items-center justify-center gap-2 h-[42px] w-[42px] sm:w-auto px-0 sm:px-4 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.05)] shrink-0"
          title="Buka Panduan Penggunaan Peta"
        >
          <HelpCircle size={15} />
          <span className="hidden sm:inline">Panduan</span>
        </button>
      </div>
    </div>
  );
};

export default MapHeader;

