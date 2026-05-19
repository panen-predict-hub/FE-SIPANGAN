import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Loader2, Info } from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Area 
} from 'recharts';

const PriceSidebarChart = ({
  prices,
  isLoading,
  selectedRange,
  onRangeChange
}) => {
  return (
    <motion.div 
      key="content"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 relative"
    >
      {/* Chart Section */}
      <div className="space-y-4 relative">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} /> {selectedRange} Data Points
            </h4>
            {prices.length > 0 && (
              <p className="text-[10px] text-gray-500 font-bold mt-0.5 ml-6">
                Period: {new Date(prices[0].date).getFullYear()} — {new Date(prices[prices.length - 1].date).getFullYear()}
              </p>
            )}
          </div>
          
          {/* Range Selector */}
          <div className="flex bg-gray-800/50 p-1 rounded-xl border border-gray-700/50">
            {[12, 24, 120].map((r) => (
              <button
                key={r}
                onClick={() => !isLoading && onRangeChange(r)}
                disabled={isLoading}
                className={`
                  px-3 py-1 rounded-lg text-[10px] font-black transition-all
                  ${selectedRange === r 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'text-gray-500 hover:text-gray-300'}
                  ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
                `}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          {/* Loading Overlay for Chart */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 bg-gray-950/20 backdrop-blur-[2px] rounded-3xl flex items-center justify-center border border-emerald-500/10"
              >
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">Updating Data</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`h-[200px] lg:h-[250px] w-full bg-gray-800/10 rounded-3xl p-4 border border-gray-800/30 transition-all duration-500 ${isLoading ? 'opacity-40 grayscale animate-pulse' : 'opacity-100'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={prices} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredict" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="bold"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(str) => {
                    const date = new Date(str);
                    return date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
                  }}
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
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontWeight: '900', fontSize: '12px' }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px', fontWeight: 'bold', fontSize: '10px' }}
                  formatter={(value, name) => [
                    `Rp ${new Intl.NumberFormat('id-ID').format(value)}`, 
                    name === 'actualPrice' ? 'Current Price' : 'Forecasted'
                  ]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                />
                <Area 
                  type="monotone" 
                  dataKey="actualPrice" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorActual)" 
                  animationDuration={1000}
                />
                <Area 
                  type="monotone" 
                  dataKey="predictedPrice" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  strokeDasharray="6 6"
                  fillOpacity={1} 
                  fill="url(#colorPredict)" 
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className={`bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 ${isLoading ? 'animate-pulse' : ''}`}>
        <div className="flex gap-4">
          <div className="mt-1">
            <Info className="text-emerald-500" size={18} />
          </div>
          <div>
            <h5 className="text-sm font-black text-emerald-400 mb-1 tracking-tight">Supply Forecast</h5>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              The market trend shows stability for the next 3 months. Local production is expected to meet demand with a projected price variance of <span className="text-emerald-400 font-bold">±2%</span>.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PriceSidebarChart;
