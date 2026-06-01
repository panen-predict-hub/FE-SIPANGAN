import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowUpRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { EmptyState } from './DashboardShared';

const CommodityPriceCard = ({ item }) => {
  const hasChange = item.changePercent !== null;
  const isUp = item.changePercent > 0;
  const isDown = item.changePercent < 0;

  return (
    <div className="group bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-emerald-500/20 rounded-2xl p-5 transition-all duration-300 cursor-default">
      {/* Nama komoditas + badge trend */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Package size={13} className="text-emerald-400" />
          </div>
          <span className="text-xs font-black text-white leading-tight">{item.name}</span>
        </div>
        {hasChange && (
          <span
            className={`shrink-0 flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-full ${
              isUp
                ? 'bg-red-500/10 text-red-400'
                : isDown
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-gray-500/10 text-gray-400'
            }`}
          >
            {isUp ? <TrendingUp size={9} /> : isDown ? <TrendingDown size={9} /> : <Minus size={9} />}
            {Math.abs(item.changePercent).toFixed(1)}%
          </span>
        )}
      </div>

      {/* Harga rata-rata */}
      <div className="mb-3">
        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Rata-rata</p>
        <p className="text-xl font-black text-white tracking-tight">
          <span className="text-xs text-emerald-500 mr-1">Rp</span>
          {item.avgPrice.toLocaleString('id-ID')}
          <span className="text-[10px] text-gray-600 font-bold ml-1">/{item.unit}</span>
        </p>
      </div>

      {/* Min / Max */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
        <div>
          <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Min</p>
          <p className="text-[11px] font-black text-emerald-400">
            Rp {item.minPrice.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Max</p>
          <p className="text-[11px] font-black text-red-400">
            Rp {item.maxPrice.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <p className="text-[9px] text-gray-600 font-bold mt-2">{item.regionCount} wilayah tercatat</p>
    </div>
  );
};

const CommodityCardSkeleton = () => (
  <div className="bg-white/[0.03] border border-white/[0.04] rounded-2xl p-5 animate-pulse">
    <div className="h-2 w-20 bg-white/10 rounded-full mb-4" />
    <div className="h-7 w-28 bg-white/10 rounded-lg mb-2" />
    <div className="h-2 w-16 bg-white/5 rounded-full" />
  </div>
);

const DashboardPriceOverview = ({ overviewData, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#030712]/40 border border-white/[0.05] p-6 sm:p-8 rounded-[2rem] shadow-xl backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Package size={20} className="text-emerald-500" />
            Ringkasan Harga Terkini
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Rata-rata harga komoditas dari seluruh wilayah Jawa Timur hari ini.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/manage')}
          className="self-start sm:self-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 hover:border-white/10 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 group cursor-pointer"
        >
          <span>Kelola Harga</span>
          <ArrowUpRight
            size={14}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CommodityCardSkeleton key={i} />
          ))}
        </div>
      ) : overviewData.length === 0 ? (
        <EmptyState icon={Package} message="Belum ada data harga tersedia" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {overviewData.map((item) => (
            <CommodityPriceCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPriceOverview;
