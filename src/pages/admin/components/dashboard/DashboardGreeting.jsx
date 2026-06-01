import React from 'react';
import { RefreshCw } from 'lucide-react';
import { getGreeting } from './dashboardHelpers';

const DashboardGreeting = ({ userFullname, lastRefresh, onRefresh }) => (
  <div className="relative p-6 sm:p-8 bg-gradient-to-r from-emerald-500/10 via-blue-500/5 to-transparent border border-white/[0.06] rounded-[2rem] overflow-hidden backdrop-blur-xl">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.1),transparent_40%)]" />
    <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="space-y-2">
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.25em] block">
          Pusat Kendali Sipangan
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">
          {getGreeting()},{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
            {userFullname}
          </span>
          !
        </h2>
        <p className="text-xs text-gray-400 font-medium max-w-xl">
          Sistem berfungsi secara optimal. Di bawah ini adalah ringkasan perkembangan spasial,
          visualisasi fluktuasi harga komoditas pangan, dan log aktivitas operasional terbaru.
        </p>
      </div>
      <button
        onClick={onRefresh}
        className="self-start flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/5 hover:border-white/10 text-xs font-bold uppercase tracking-widest transition-all group cursor-pointer shrink-0"
        title="Refresh data"
      >
        <RefreshCw size={13} className="group-hover:rotate-180 transition-transform duration-500" />
        <span className="hidden sm:inline">Refresh</span>
      </button>
    </div>
    <p className="relative z-10 mt-3 text-[9px] text-gray-600 font-bold">
      Terakhir diperbarui:{' '}
      {lastRefresh.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}
    </p>
  </div>
);

export default DashboardGreeting;
