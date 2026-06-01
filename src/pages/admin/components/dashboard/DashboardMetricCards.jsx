import React from 'react';
import { Database, AlertTriangle, Users, Activity } from 'lucide-react';
import { SkeletonCard } from './DashboardShared';

const DashboardMetricCards = ({ stats, loading, userRole }) => {
  const metricCards = [
    {
      title: 'Komoditas Dipantau',
      value: stats.commodities,
      subtitle: 'Total jenis pangan',
      icon: Database,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Wilayah Krisis (EWS)',
      value: stats.activeAlerts,
      subtitle: 'Ambang harga terlewati',
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
    {
      title: 'Akun Pengguna',
      value: stats.systemUsers,
      subtitle:
        userRole === 'super_admin'
          ? 'Total semua akun sistem'
          : 'Total operator dikelola',
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Status Sistem',
      value: stats.systemStatus,
      subtitle: 'Uptime 99.98% aktif',
      icon: Activity,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((card, i) => (
        <div
          key={i}
          className="group relative bg-[#030712]/50 border border-white/[0.04] p-6 rounded-3xl shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-gray-950/80 cursor-default"
        >
          <div
            className={`absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-10 group-hover:opacity-20 transition-all rounded-full ${card.bg}`}
          />
          <div className="relative z-10 flex flex-col justify-between h-full gap-4">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                {card.title}
              </span>
              <div
                className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center border border-white/5`}
              >
                <card.icon size={18} className={card.color} />
              </div>
            </div>
            <div>
              <span className="text-3xl font-black text-white tracking-tight leading-none block">
                {card.value ?? <span className="text-gray-600 text-lg">—</span>}
              </span>
              <span className="text-[10px] text-gray-500 font-bold mt-1.5 block">
                {card.subtitle}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetricCards;
