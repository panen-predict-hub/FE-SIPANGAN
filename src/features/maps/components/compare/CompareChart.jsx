import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Loader2 } from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Area, Legend 
} from 'recharts';

const CompareChart = ({
  chartData,
  isFetching,
  selectedCommodity,
  regionA,
  regionB
}) => {
  return (
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
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b', 
                    borderRadius: '12px', 
                    padding: typeof window !== 'undefined' && window.innerWidth < 640 ? '6px 10px' : '12px' 
                  }}
                  itemStyle={{ fontWeight: '900', fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? '10px' : '12px' }}
                  labelStyle={{ color: '#64748b', marginBottom: '2px', fontWeight: 'bold', fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? '8px' : '10px' }}
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
  );
};

export default CompareChart;
