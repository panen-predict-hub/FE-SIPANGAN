import React from 'react';

// ─── Skeleton loader saat data masih loading ───
export const SkeletonCard = () => (
  <div className="bg-[#030712]/50 border border-white/[0.04] p-6 rounded-3xl animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-2 w-24 bg-white/10 rounded-full" />
      <div className="w-10 h-10 bg-white/10 rounded-xl" />
    </div>
    <div className="h-8 w-16 bg-white/10 rounded-lg mb-2" />
    <div className="h-2 w-20 bg-white/5 rounded-full" />
  </div>
);

// ─── Reusable empty state ───
export const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-600">
    <Icon size={28} className="opacity-40" />
    <p className="text-xs font-bold uppercase tracking-widest">{message}</p>
  </div>
);
