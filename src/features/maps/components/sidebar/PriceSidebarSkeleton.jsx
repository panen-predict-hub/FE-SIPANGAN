import React from 'react';
import { motion } from 'framer-motion';

const PriceSidebarSkeleton = () => {
  return (
    <motion.div 
      key="skeleton"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Range & Info Selector Skeleton */}
      <div className="flex items-center justify-between animate-pulse">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-gray-800 rounded-md"></div>
          <div className="h-2.5 w-40 bg-gray-800/60 rounded-md"></div>
        </div>
        {/* Pill range selector placeholder */}
        <div className="flex bg-gray-800/30 p-1 rounded-xl border border-gray-800/50 gap-1.5">
          <div className="w-7 h-5 bg-gray-800 rounded-lg"></div>
          <div className="w-7 h-5 bg-gray-800 rounded-lg"></div>
          <div className="w-7 h-5 bg-gray-800 rounded-lg"></div>
        </div>
      </div>

      {/* Advanced Chart Skeleton with mock lines & grid */}
      <div className="h-[200px] lg:h-[250px] w-full bg-gray-800/10 rounded-3xl p-6 border border-gray-800/30 relative overflow-hidden animate-pulse flex flex-col justify-between">
        {/* Vertical Y-axis tick lines & mock values */}
        <div className="flex-1 flex gap-4">
          {/* Mock Y-axis */}
          <div className="flex flex-col justify-between h-full pb-6 text-right pr-2">
            <div className="h-2 w-6 bg-gray-800 rounded"></div>
            <div className="h-2 w-6 bg-gray-800 rounded"></div>
            <div className="h-2 w-6 bg-gray-800 rounded"></div>
            <div className="h-2 w-6 bg-gray-800 rounded"></div>
          </div>
          
          {/* Grid Lines and Area Path */}
          <div className="flex-1 h-full relative border-l border-b border-gray-800/40 pb-6 flex flex-col justify-between">
            {/* Horizontal grid lines */}
            <div className="w-full border-t border-gray-800/30"></div>
            <div className="w-full border-t border-gray-800/30"></div>
            <div className="w-full border-t border-gray-800/30"></div>
            
            {/* Futuristic Mock SVG Line & Gradient Wave */}
            <div className="absolute inset-0 bottom-6 opacity-30">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                  <linearGradient id="skeletonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#374151" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1f2937" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Shimmering line */}
                <path 
                  d="M0,80 Q20,30 40,60 T80,20 T100,40 L100,100 L0,100 Z" 
                  fill="url(#skeletonGrad)" 
                  stroke="#4b5563" 
                  strokeWidth="2" 
                  className="animate-pulse"
                />
                <path 
                  d="M0,80 Q20,30 40,60 T80,20 T100,40" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="1.5" 
                  strokeDasharray="3 3"
                  className="animate-pulse opacity-40"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Mock X-axis along bottom */}
        <div className="flex justify-between pl-12 pt-2 border-t border-gray-800/20">
          <div className="h-2 w-8 bg-gray-800 rounded"></div>
          <div className="h-2 w-8 bg-gray-800 rounded"></div>
          <div className="h-2 w-8 bg-gray-800 rounded"></div>
          <div className="h-2 w-8 bg-gray-800 rounded"></div>
        </div>
      </div>

      {/* Detailed Info Card Skeleton */}
      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 flex gap-4 animate-pulse">
        <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shrink-0 flex items-center justify-center">
          <div className="w-3.5 h-3.5 bg-emerald-500/30 rounded-full"></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-32 bg-emerald-500/20 rounded-md"></div>
          <div className="space-y-1.5">
            <div className="h-2.5 w-full bg-gray-800 rounded"></div>
            <div className="h-2.5 w-[90%] bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PriceSidebarSkeleton;
