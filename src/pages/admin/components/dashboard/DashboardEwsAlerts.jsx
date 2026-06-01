import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ChevronRight, Loader2 } from 'lucide-react';
import { EmptyState } from './DashboardShared';

const AlertRow = ({ alert }) => (
  <div className="p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] hover:border-white/10 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300">
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          alert.status === 'danger'
            ? 'bg-red-500/10 text-red-500'
            : alert.status === 'warning'
            ? 'bg-yellow-500/10 text-yellow-500'
            : 'bg-emerald-500/10 text-emerald-500'
        }`}
      >
        <AlertTriangle size={14} />
      </div>
      <div>
        <span className="text-xs font-black text-white">{alert.commodity}</span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-gray-400 font-bold">{alert.region}</span>
          <span className="text-[8px] text-gray-600 font-black">•</span>
          <span className="text-[9px] text-gray-500 font-bold">{alert.time}</span>
        </div>
      </div>
    </div>
    <div className="text-right">
      <span className="text-xs font-black text-white block">{alert.price}</span>
      <span
        className={`text-[9px] font-black uppercase mt-0.5 inline-block px-2 py-0.5 rounded-full ${
          alert.status === 'danger'
            ? 'bg-red-500/10 text-red-400'
            : alert.status === 'warning'
            ? 'bg-yellow-500/10 text-yellow-400'
            : 'bg-emerald-500/10 text-emerald-400'
        }`}
      >
        {alert.change}
      </span>
    </div>
  </div>
);

const DashboardEwsAlerts = ({ alerts, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#030712]/40 border border-white/[0.05] p-6 sm:p-8 rounded-[2rem] shadow-xl backdrop-blur-md flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            Peringatan Deteksi EWS Terbaru
          </h3>
          <p className="text-[11px] text-gray-500 font-medium">
            Anomali fluktuasi harga kritis harian tingkat kabupaten/kota.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/map')}
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <Loader2 size={24} className="text-red-400 animate-spin" />
        </div>
      ) : alerts.length === 0 ? (
        <EmptyState icon={AlertTriangle} message="Tidak ada peringatan aktif" />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertRow key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardEwsAlerts;
