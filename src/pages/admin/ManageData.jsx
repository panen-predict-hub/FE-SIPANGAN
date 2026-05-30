import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Package, TrendingUp, ChevronRight, CloudRain, Loader2 } from 'lucide-react';
import { commodityService, weatherService } from '../../api/services';
import CommodityTable from './components/CommodityTable';
import PriceTable from './components/PriceTable';
import CustomAlert from '../../components/CustomAlert';

const ManageData = () => {
  const [activeTab, setActiveTab] = useState('prices'); // default to prices
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingWeather, setSyncingWeather] = useState(false);

  // Alert State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    isConfirm: false,
    onConfirm: null
  });

  const showAlert = (config) => {
    setAlertConfig({ ...config, isOpen: true });
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, isOpen: false });
  };

  const tabs = [
    { id: 'prices', label: 'Price Records', icon: TrendingUp, color: 'text-blue-500' },
    { id: 'commodities', label: 'Commodity Catalog', icon: Package, color: 'text-emerald-500' },
  ];

  const handleTabChange = (tabId) => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    const newIndex = tabs.findIndex(t => t.id === tabId);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(tabId);
  };

  const fetchCommodities = async () => {
    setLoading(true);
    try {
      const response = await commodityService.getAll();
      setCommodities(response.data || []);
    } catch (error) {
      console.error('Failed to load commodities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommodities();
  }, []);

  const handleSyncWeather = async () => {
    try {
      setSyncingWeather(true);
      await weatherService.syncWeather();
      showAlert({
        title: 'Success!',
        message: 'Weather data synchronized successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to sync weather:', error);
      showAlert({
        title: 'Error!',
        message: 'Failed to synchronize weather data. Please try again.',
        type: 'error'
      });
    } finally {
      setSyncingWeather(false);
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="max-w-6xl flex flex-col gap-6 sm:gap-8 animate-in fade-in slide-in-from-bottom duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-[0.3em]">
          Admin <ChevronRight size={12} /> Data Management
        </div>
        <div className="flex items-center justify-between gap-3 w-full">
          <h1 className="text-lg sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-2 sm:gap-3 min-w-0">
            <Database className="text-emerald-500 shrink-0" size={20} />
            <span className="truncate">Kelola Data Pangan</span>
          </h1>
          
          <button
            onClick={handleSyncWeather}
            disabled={syncingWeather}
            className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 shrink-0 h-[34px] sm:h-[42px]"
          >
            {syncingWeather ? <Loader2 className="animate-spin" size={14} /> : <CloudRain size={14} />}
            <span className="hidden sm:inline">{syncingWeather ? 'Syncing...' : 'Sync Weather'}</span>
            <span className="sm:hidden">{syncingWeather ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>
        <p className="text-gray-400 font-medium text-sm sm:text-base">
          Manage commodity inventory and maintain historical price data across East Java.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl w-full max-w-fit overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                relative flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0
                ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gray-800 border border-gray-700 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <tab.icon size={16} className={isActive ? tab.color : 'text-current'} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            {activeTab === 'commodities' ? (
              <CommodityTable
                commodities={commodities}
                loading={loading}
                onRefresh={fetchCommodities}
              />
            ) : (
              <PriceTable
                commodities={commodities}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <CustomAlert
        {...alertConfig}
        onClose={closeAlert}
      />
    </div>
  );
};

export default ManageData;
