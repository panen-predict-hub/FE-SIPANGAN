import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, Search } from 'lucide-react';

const CompareSelector = ({
  label,
  region,
  isOpen,
  onToggle,
  search,
  onSearchChange,
  filteredList,
  onSelect,
  theme = 'emerald'
}) => {
  const isEmerald = theme === 'emerald';

  const labelColor = isEmerald ? 'text-emerald-500' : 'text-indigo-400';
  const pinColor = isEmerald ? 'text-emerald-500' : 'text-indigo-400';
  const hoverBorderColor = isEmerald ? 'hover:border-emerald-500/50' : 'hover:border-indigo-500/50';
  const hoverBg = isEmerald ? 'hover:bg-emerald-500/10 hover:text-emerald-400' : 'hover:bg-indigo-500/10 hover:text-indigo-400';
  const focusBorder = isEmerald ? 'focus:border-emerald-500/50' : 'focus:border-indigo-500/50';

  return (
    <div className="relative">
      <label className={`text-[9px] ${labelColor} font-black uppercase tracking-widest block mb-2`}>
        {label}
      </label>
      
      <div 
        onClick={onToggle}
        className={`w-full bg-gray-900/50 border border-gray-800/80 ${hoverBorderColor} rounded-2xl p-3 sm:p-4 flex items-center justify-between cursor-pointer transition-all text-white`}
      >
        <div className="flex items-center gap-3">
          <MapPin className={pinColor} size={18} />
          <span className="text-xs sm:text-sm font-bold">
            {region ? region.name : `Pilih ${label.replace('Wilayah Pembanding ', 'Wilayah ')}`}
          </span>
        </div>
        <ChevronDown 
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          size={16} 
        />
      </div>

      <AnimatePresence>
        {isOpen && (
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
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full bg-gray-950 border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 outline-none ${focusBorder}`}
              />
            </div>
            
            <div className="space-y-1 overflow-y-auto max-h-40">
              {filteredList.length > 0 ? (
                filteredList.map(r => (
                  <button
                    key={r.name}
                    onClick={() => onSelect(r)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs text-gray-300 ${hoverBg} transition-all font-semibold flex items-center justify-between`}
                  >
                    <span>{r.name}</span>
                    <span className="text-[9px] font-black uppercase text-gray-500">
                      Rp {new Intl.NumberFormat('id-ID').format(r.price || 0)}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-[10px] text-gray-600 font-bold uppercase text-center py-4">
                  Wilayah tidak ditemukan
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompareSelector;
