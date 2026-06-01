import React, { useState, useEffect } from 'react';
import { commodityService, priceService, alertService, logService, userService } from '../../api/services';
import { formatAlert, formatLog } from './components/dashboard/dashboardHelpers';
import DashboardGreeting from './components/dashboard/DashboardGreeting';
import DashboardMetricCards from './components/dashboard/DashboardMetricCards';
import DashboardPriceOverview from './components/dashboard/DashboardPriceOverview';
import DashboardEwsAlerts from './components/dashboard/DashboardEwsAlerts';
import DashboardActivityLogs from './components/dashboard/DashboardActivityLogs';

const AdminDashboard = () => {
  const userFullname = localStorage.getItem('userFullname') || 'Administrator';
  const userRole    = localStorage.getItem('userRole')    || 'operator';

  /* ── state ── */
  const [stats, setStats] = useState({
    commodities: null,
    activeAlerts: null,
    systemUsers: null,
    systemStatus: 'Operational',
  });
  const [loadingStats,    setLoadingStats]    = useState(true);
  const [overviewData,    setOverviewData]    = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [recentAlerts,    setRecentAlerts]    = useState([]);
  const [loadingAlerts,   setLoadingAlerts]   = useState(true);
  const [recentLogs,      setRecentLogs]      = useState([]);
  const [loadingLogs,     setLoadingLogs]     = useState(true);
  const [lastRefresh,     setLastRefresh]     = useState(new Date());

  /* ── fetchers ── */
  const fetchStats = async () => {
    setLoadingStats(true);
    let commoditiesCount = null;
    let alertsCount      = null;
    let usersCount       = null;

    try {
      const res = await commodityService.getAll();
      commoditiesCount = res?.data?.length ?? 0;
    } catch (e) { console.warn('commodities count:', e.message); }

    try {
      const res = await alertService.getAlerts();
      if (res?.data) {
        alertsCount = res.data.filter(
          (a) => a.type === 'critical' || a.type === 'warning'
        ).length;
      }
    } catch (e) { console.warn('alerts count:', e.message); }

    try {
      if (userRole === 'super_admin' || userRole === 'admin') {
        const res      = await userService.getAll();
        const allUsers = res?.data?.users ?? [];
        usersCount     = Array.isArray(allUsers) ? allUsers.length : 0;
      }
    } catch (e) { console.warn('users count:', e.message); }

    setStats({ commodities: commoditiesCount, activeAlerts: alertsCount, systemUsers: usersCount, systemStatus: 'Operational' });
    setLoadingStats(false);
  };

  const fetchOverview = async () => {
    setLoadingOverview(true);
    try {
      const comRes      = await commodityService.getAll();
      const commodities = comRes?.data ?? [];
      if (commodities.length === 0) { setOverviewData([]); return; }

      const results = await Promise.allSettled(
        commodities.map((c) => priceService.getOverview({ commodity: c.name }))
      );

      const summary = [];
      results.forEach((result, i) => {
        if (result.status !== 'fulfilled') return;
        const raw       = result.value?.data ?? result.value ?? [];
        const dataArray = Array.isArray(raw) ? raw : (raw?.data ?? []);
        if (dataArray.length === 0) return;

        const prices = dataArray.map((d) => Number(d.current_price)).filter((p) => p > 0);
        if (prices.length === 0) return;

        const avgPrice = Math.round(prices.reduce((s, v) => s + v, 0) / prices.length);
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);

        const prevPrices    = dataArray.map((d) => Number(d.previous_price)).filter((p) => p > 0);
        const avgPrev       = prevPrices.length
          ? Math.round(prevPrices.reduce((s, v) => s + v, 0) / prevPrices.length) : 0;
        const changePercent = avgPrev > 0
          ? parseFloat((((avgPrice - avgPrev) / avgPrev) * 100).toFixed(1)) : null;

        summary.push({
          id: commodities[i].id,
          name: commodities[i].name,
          unit: commodities[i].unit || 'kg',
          avgPrice,
          maxPrice,
          minPrice,
          changePercent,
          regionCount: dataArray.length,
        });
      });
      setOverviewData(summary);
    } catch (e) {
      console.warn('price overview:', e.message);
      setOverviewData([]);
    } finally {
      setLoadingOverview(false);
    }
  };

  const fetchAlerts = async () => {
    setLoadingAlerts(true);
    try {
      const res = await alertService.getAlerts();
      setRecentAlerts((res?.data ?? []).slice(0, 4).map(formatAlert));
    } catch (e) {
      console.warn('alerts:', e.message);
      setRecentAlerts([]);
    } finally {
      setLoadingAlerts(false);
    }
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await logService.getLogs({ limit: 4 });
      const raw = res?.data?.logs || res?.logs || (Array.isArray(res?.data) ? res.data : []);
      setRecentLogs(raw.slice(0, 4).map(formatLog));
    } catch (e) {
      console.warn('logs:', e.message);
      setRecentLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    fetchStats();
    fetchOverview();
    fetchAlerts();
    fetchLogs();
  };

  useEffect(() => {
    fetchStats();
    fetchOverview();
    fetchAlerts();
    fetchLogs();
  }, [userRole]);

  /* ── render ── */
  return (
    <div className="space-y-8 pb-10">
      <DashboardGreeting
        userFullname={userFullname}
        lastRefresh={lastRefresh}
        onRefresh={handleRefresh}
      />

      <DashboardMetricCards
        stats={stats}
        loading={loadingStats}
        userRole={userRole}
      />

      <DashboardPriceOverview
        overviewData={overviewData}
        loading={loadingOverview}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardEwsAlerts
          alerts={recentAlerts}
          loading={loadingAlerts}
        />
        <DashboardActivityLogs
          logs={recentLogs}
          loading={loadingLogs}
          userRole={userRole}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
