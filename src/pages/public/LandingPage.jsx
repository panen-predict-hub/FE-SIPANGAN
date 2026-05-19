import React from 'react';
import { Link } from 'react-router-dom';
import {
  Map as MapIcon,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  ArrowRight
} from 'lucide-react';
import PriceMarquee from '../../components/PriceMarquee';

const LandingPage = () => {
  return (
    <div className="space-y-16 md:space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-6 md:pt-10 px-4 md:px-0">
        <div className="relative text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom duration-500 max-w-full text-center">
            <Zap size={12} fill="currentColor" className="shrink-0" /> 
            <span className="truncate">Waypoint - Coding Camp 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] md:leading-[0.95] animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            Sistem Informasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 block sm:inline">Ketahanan Pangan.</span>
          </h1>

          <p className="text-xs sm:text-base md:text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            SIPANGAN adalah aplikasi inovatif hasil pengembangan Capstone Project untuk memonitor distribusi, fluktuasi harga, dan prediksi ketahanan komoditas pasar secara Real-Time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 animate-in fade-in slide-in-from-bottom duration-700 delay-300 w-full max-w-md mx-auto sm:max-w-none">
            <Link
              to="/map"
              className="w-full sm:w-auto justify-center group relative px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
            >
              Buka Peta Interaktif
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#about"
              className="w-full sm:w-auto text-center justify-center px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm border border-white/5 hover:border-white/10 transition-all flex items-center"
            >
              Tentang Proyek
            </a>
          </div>
        </div>
      </section>

      {/* Live Ticker Section */}
      <section className="relative w-full overflow-hidden">
        <PriceMarquee />
      </section>

      {/* About Project */}
      <section id="about" className="bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-16 relative overflow-hidden mx-4 md:mx-0">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none hidden lg:block">
          <Layers size={200} className="text-emerald-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300 text-[10px] font-black uppercase tracking-widest">
              Latar Belakang
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Membangun Ekosistem <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 block sm:inline">Pangan yang Transparan.</span>
            </h2>
            <p className="text-gray-400 font-medium text-xs sm:text-base leading-relaxed">
              Aplikasi ini dikembangkan secara khusus sebagai pemenuhan tugas akhir (Capstone Project) dari program <strong>Coding Camp 2026</strong>. 
              Fokus utama kami adalah mengatasi ketimpangan informasi harga pangan dan mendeteksi secara dini potensi kelangkaan komoditas di wilayah Jawa Timur.
            </p>
            <div className="space-y-3 pt-2">
              {[
                "Memanfaatkan data historis untuk mendeteksi anomali harga.",
                "Memberikan peringatan dini (Alert) saat terjadi lonjakan ekstrem.",
                "Menampilkan pemetaan spasial surplus/defisit pangan antar daerah.",
                "Sistem manajemen data admin yang terintegrasi dan aman."
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-black text-white mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-300 font-bold leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group w-full">
            <div className="absolute inset-0 bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
            <div className="relative bg-gray-950 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-2 overflow-hidden shadow-2xl">
              <div className="bg-gray-900 h-48 sm:h-64 lg:h-80 rounded-[1.2rem] sm:rounded-[1.5rem] flex items-center justify-center relative overflow-hidden">
                <TrendingUp size={100} className="text-emerald-500/20 animate-pulse" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-3 sm:p-4 bg-gray-950/80 backdrop-blur border border-white/5 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest">Akurasi Deteksi</span>
                    <span className="text-[8px] sm:text-[10px] font-black text-emerald-500">REAL-TIME</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[100%] animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="relative px-4 md:px-0">
        <div className="text-center mb-10 md:mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Teknologi & Fitur Mutakhir</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Solusi arsitektur cerdas yang menenagai SIPANGAN.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: "Geospatial Visualizer",
              desc: "Pemetaan interaktif berbasis TopoJSON yang memungkinkan Anda melihat distribusi surplus dan defisit harga komoditas per wilayah secara langsung.",
              icon: MapIcon,
              color: "text-blue-500",
              bg: "bg-blue-500/10"
            },
            {
              title: "Automated Early Warning",
              desc: "Sistem pendeteksi anomali harga otomatis. Operator tidak perlu mengecek manual; sistem akan membunyikan 'Alert' bila terdeteksi lonjakan harga kritis.",
              icon: Zap,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10"
            },
            {
              title: "Enterprise Security",
              desc: "Keamanan data tingkat tinggi dengan autentikasi JWT Multi-Role (Super Admin, Admin, Operator) dan enkripsi untuk melindungi integritas sistem.",
              icon: ShieldCheck,
              color: "text-amber-500",
              bg: "bg-amber-500/10"
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 sm:p-8 bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] hover:border-white/10 transition-all group">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 ${feature.bg} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-white/5`}>
                <feature.icon size={24} className={feature.color} />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mb-2 sm:mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Developer Info */}
      <section className="text-center py-12 md:py-20 relative border-t border-white/5 px-4 md:px-0 mt-16 md:mt-20">
        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-500/10 border border-blue-500/20 mb-1">
            <span className="text-lg sm:text-2xl font-black text-blue-500">C26</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Dikembangkan Oleh Tim Capstone</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed max-w-xl mx-auto">
            Terima kasih telah menggunakan SIPANGAN. Proyek ini merupakan bagian dari karya inovasi di <strong>Coding Camp 2026</strong>. 
            Jika Anda memiliki pertanyaan, masukan, atau tawaran kerja sama untuk mengembangkan platform ini ke skala nasional, silakan hubungi kami.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 w-full max-w-sm sm:max-w-none mx-auto">
            <a 
              href="mailto:syahrefaldi@gmail.com" 
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              📧 Hubungi via Email
            </a>
            <a 
              href="https://github.com/panen-predict-hub" 
              target="_blank" 
              rel="noreferrer" 
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs border border-white/5 hover:border-white/10 transition-all flex items-center justify-center gap-2"
            >
              💻 GitHub Repository
            </a>
          </div>
          <p className="text-[8px] sm:text-[10px] text-gray-600 font-bold uppercase tracking-widest pt-6">
            &copy; 2026 SIPANGAN - Coding Camp Capstone Project. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
