import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Map, 
  TrendingUp, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Info
} from 'lucide-react';

const GuideModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Peta Interaktif Jawa Timur",
      description: "Jelajahi pemetaan spasial komoditas ketahanan pangan secara real-time.",
      icon: <Map className="text-emerald-400" size={32} />,
      badge: "Navigasi Peta",
      content: (
        <div className="space-y-4">
          <p className="text-gray-400 text-xs leading-relaxed">
            Peta digital interaktif kami mencakup seluruh wilayah di Jawa Timur. Desain kami ramah terhadap perangkat seluler (HP) dengan fitur navigasi ganda.
          </p>
          <div className="space-y-2">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-3 flex gap-3 items-start">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black mt-0.5">1</span>
              <p className="text-[11px] text-gray-300 font-medium leading-normal">
                <strong>Klik Wilayah:</strong> Ketuk wilayah pada peta untuk membuka analisis tren harga dan ramalan pasokan AI di bilah samping/bawah.
              </p>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-3 flex gap-3 items-start">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 text-xs font-black mt-0.5">2</span>
              <p className="text-[11px] text-gray-300 font-medium leading-normal">
                <strong>Scroll-Lock Seluler:</strong> Di HP, gunakan tombol <span className="text-blue-400 font-bold">🔒 Peta Terkunci</span> untuk mengaktifkan kunci peta agar Anda bisa men-scroll halaman web ke bawah dengan lancar tanpa macet!
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Arti Kode Warna Wilayah",
      description: "Sistem pendeteksi anomali membagi tingkat kerawanan harga ke dalam 3 warna.",
      icon: <Info className="text-blue-400" size={32} />,
      badge: "Status Ketahanan",
      content: (
        <div className="space-y-3">
          <p className="text-gray-400 text-xs leading-relaxed">
            Choropleth warna pada peta disesuaikan secara dinamis berdasarkan perbandingan harga riil pasar dengan ambang batas normal:
          </p>
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-3 p-2.5 bg-gray-900/50 border border-white/5 rounded-xl">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></span>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white">Status Aman (Hijau)</span>
                <span className="text-[10px] text-gray-500">Harga stabil dan berada di kisaran target normal.</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 bg-gray-900/50 border border-white/5 rounded-xl">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.5)]"></span>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white">Status Waspada (Kuning)</span>
                <span className="text-[10px] text-gray-500">Kenaikan harga moderat atau terdeteksi fluktuasi tidak wajar.</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 bg-gray-900/50 border border-white/5 rounded-xl">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.5)]"></span>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white">Status Krisis (Merah)</span>
                <span className="text-[10px] text-gray-500">Lonjakan harga ekstrem melebihi ambang batas toleransi pasar.</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Prediksi Harga AI & Tren",
      description: "Gunakan kecerdasan buatan untuk mengantisipasi gejolak harga pangan.",
      icon: <Sparkles className="text-purple-400" size={32} />,
      badge: "AI Forecast",
      content: (
        <div className="space-y-4">
          <p className="text-gray-400 text-xs leading-relaxed">
            Setelah Anda memilih daerah, bilah analisis samping akan menyajikan chart komprehensif yang menampilkan:
          </p>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col justify-center">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-1">Data Historis</span>
              <p className="text-[9px] text-gray-400 leading-normal font-medium">Rekaman tren fluktuasi harga komoditas selama 12 bulan terakhir.</p>
            </div>
            <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl flex flex-col justify-center">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider mb-1">AI Prediction</span>
              <p className="text-[9px] text-gray-400 leading-normal font-medium">Estimasi harga masa depan yang diproses oleh model prediktif machine learning.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    onClose();
    // Delay resetting step until closing animation finishes
    setTimeout(() => setCurrentStep(0), 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg border border-white/10 rounded-[2.5rem] bg-gray-950/90 backdrop-blur-2xl p-8 md:p-10 shadow-2xl overflow-hidden"
          >
            {/* Glass Radial Glow */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]"></div>
              <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
            </div>

            {/* Header Steps */}
            <div className="relative z-10 flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">Panduan Penggunaan</h4>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                    Langkah {currentStep + 1} dari {steps.length}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all active:scale-95 border border-white/5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Slider Content */}
            <div className="relative z-10 min-h-[260px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl shrink-0 shadow-lg">
                      {steps[currentStep].icon}
                    </div>
                    <div>
                      <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-full">
                        {steps[currentStep].badge}
                      </span>
                      <h3 className="text-lg font-black text-white mt-1 tracking-tight">
                        {steps[currentStep].title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider leading-relaxed">
                    {steps[currentStep].description}
                  </p>

                  <div className="pt-2">
                    {steps[currentStep].content}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Controls */}
              <div className="relative z-10 flex items-center justify-between pt-8 border-t border-white/5 mt-8">
                {/* Dots indicator */}
                <div className="flex gap-2">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentStep(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentStep ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/10 hover:bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <button
                      onClick={handleBack}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-white/5 flex items-center gap-1.5"
                    >
                      <ChevronLeft size={14} /> Kembali
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95"
                  >
                    {currentStep === steps.length - 1 ? (
                      <>Mulai Jelajah <Sparkles size={14} fill="currentColor" /></>
                    ) : (
                      <>Lanjut <ChevronRight size={14} /></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GuideModal;
