import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, ShieldCheck, Loader2 } from 'lucide-react';
import { EmptyState } from './DashboardShared';

const LogRow = ({ log }) => (
  <div className="p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] hover:border-white/10 rounded-2xl flex items-start gap-4 transition-all duration-300">
    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
      <ShieldCheck size={14} />
    </div>
    <div className="flex-1 space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-black text-white truncate">{log.user}</span>
        <span className="text-[9px] text-gray-500 font-bold shrink-0">{log.time}</span>
      </div>
      <p className="text-xs text-gray-400 font-medium leading-relaxed">{log.action}</p>
    </div>
  </div>
);

const DashboardActivityLogs = ({ logs, loading, userRole }) => {
  const navigate = useNavigate();
  const canViewLogs = userRole === 'super_admin' || userRole === 'admin';

  return (
    <div className="bg-[#030712]/40 border border-white/[0.05] p-6 sm:p-8 rounded-[2rem] shadow-xl backdrop-blur-md flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <Clock size={18} className="text-purple-500" />
            Log Aktivitas Admin Terkini
          </h3>
          <p className="text-[11px] text-gray-500 font-medium">
            Audit jejak aktivitas administrator sistem.
          </p>
        </div>
        <button
          onClick={() => canViewLogs && navigate('/admin/logs')}
          disabled={!canViewLogs}
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <Loader2 size={24} className="text-purple-400 animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <EmptyState icon={Clock} message="Belum ada log aktivitas" />
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <LogRow key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardActivityLogs;
