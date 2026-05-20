import React from 'react';

const MapLegend = () => {
  const legendItems = [
    { label: 'AMAN', color: '#10b981', desc: 'Harga Stabil' },
    { label: 'WASPADA', color: '#f59e0b', desc: 'Tren Menaik' },
    { label: 'KRITIS', color: '#e11d48', desc: 'Lonjakan Harga' },
    { label: 'TANPA DATA', color: '#64748b', desc: 'Update Pending' }
  ];

  return (
    <div className="absolute bottom-3 left-3 right-3 lg:bottom-6 lg:right-6 lg:left-auto z-[1000] bg-gray-950/85 backdrop-blur-md p-2.5 lg:p-5 border border-gray-800/50 rounded-xl lg:rounded-2xl shadow-2xl lg:min-w-[180px] pointer-events-auto">
      <h4 className="text-[8px] lg:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5 lg:mb-4 text-center lg:text-left">
        Status Pasar
      </h4>
      <div className="flex flex-row lg:flex-col justify-around lg:justify-start gap-2 lg:space-y-3 lg:gap-0">
        {legendItems.map(item => (
          <div key={item.label} className="flex items-center gap-1.5 lg:gap-3 group cursor-default">
            <div className="relative shrink-0">
              <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: item.color, color: item.color }}></div>
              <div className="absolute inset-0 w-2 lg:w-2.5 lg:h-2.5 rounded-full animate-ping opacity-20" style={{ backgroundColor: item.color }}></div>
            </div>
            <div>
              <span className="block text-[8px] lg:text-[11px] text-gray-200 font-bold leading-none">{item.label}</span>
              <span className="hidden lg:block text-[9px] text-gray-500 font-medium mt-1">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
