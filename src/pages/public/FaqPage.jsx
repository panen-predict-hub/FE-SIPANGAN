import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const FaqPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Apa itu platform SIPANGAN?",
      answer: "SIPANGAN (Sistem Informasi Ketahanan Pangan) adalah platform pemantauan digital cerdas berbasis spasial dan kecerdasan buatan (AI) untuk mengawasi stabilitas harga pasar, memetakan rantai pasok pangan, serta mencegah potensi kelangkaan komoditas bahan pokok di wilayah Jawa Timur."
    },
    {
      question: "Bagaimana sistem kecerdasan buatan (AI) memprediksi harga?",
      answer: "Model peramalan AI (Machine Learning) kami membutuhkan minimal 3 bulan data historis beruntun (harga transaksi pasar) untuk dapat memproses kalkulasi dan menyajikan estimasi peramalan harga komoditas pokok secara presisi untuk bulan berikutnya."
    },
    {
      question: "Apa arti kode warna tingkat kerawanan wilayah pada peta?",
      answer: "Peta interaktif choropleth kami menggunakan skema deteksi anomali otomatis 4 status warna: HIJAU melambangkan status Aman (harga stabil), KUNING melambangkan status Waspada (fluktuasi harga sedang), MERAH melambangkan status Krisis (lonjakan ekstrem di atas batas pasar), dan ABU-ABU melambangkan wilayah Belum Terdata."
    },
    {
      question: "Mengapa peta terkunci saat dibuka di HP (Scroll Lock)?",
      answer: "Kami mengintegrasikan fitur Scroll Lock khusus seluler demi kenyamanan Anda. Di layar HP, geseran satu jari di area peta dikunci secara default agar Anda bisa men-scroll halaman web ke bawah dengan lancar tanpa macet di peta. Anda dapat mengetuk tombol '🔒 Peta Terkunci' untuk membuka kunci panning."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <section className="relative text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <HelpCircle size={12} fill="currentColor" className="shrink-0 animate-pulse" /> 
          Pusat Bantuan & FAQ
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
          Pertanyaan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Sering Diajukan.</span>
        </h1>

        <p className="text-xs sm:text-base text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
          Temukan jawaban cepat mengenai teknologi peramalan AI, sistem pemetaan geografis, dan interpretasi data harga komoditas pangan.
        </p>
      </section>

      {/* Accordion List */}
      <section className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;

          return (
            <div 
              key={index}
              className="group border border-white/5 hover:border-white/10 rounded-[2rem] bg-gray-900/20 backdrop-blur-xl transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(isOpen ? null : index)}
                className="w-full px-6 sm:px-8 py-6 flex items-center justify-between text-left gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm sm:text-base font-black text-white leading-tight tracking-tight group-hover:text-emerald-400 transition-colors">
                    {faq.question}
                  </span>
                </div>
                <div className={`p-2 bg-white/5 rounded-xl border border-white/5 text-gray-400 group-hover:text-white transition-all shrink-0 ${isOpen ? 'rotate-180 bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : ''}`}>
                  <ChevronDown size={14} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-6 sm:px-8 pb-6 pt-2 border-t border-white/5 bg-gray-950/40">
                      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-medium">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </section>

      {/* Dynamic Mini Banner */}
      <section className="bg-gradient-to-br from-emerald-500/5 to-blue-500/5 border border-white/10 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-500 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500 rounded-full blur-[100px]"></div>
        </div>

        <div className="space-y-2 text-center sm:text-left relative z-10">
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 justify-center sm:justify-start">
            <TrendingUp size={12} /> Live Market Monitoring
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">Butuh Memulai Jelajah Data Sekarang?</h3>
          <p className="text-xs text-gray-500 font-semibold max-w-md">Buka peta choropleth kami untuk mendeteksi sebaran fluktuasi harga bahan pangan pokok secara real-time.</p>
        </div>

        <a 
          href="/map"
          className="px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2 shrink-0 relative z-10"
        >
          Lihat Peta Ketahanan <ChevronRight size={14} />
        </a>
      </section>
    </div>
  );
};

export default FaqPage;
