import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../api/services';
import { Shield, Lock, User, Loader2, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import iconSipangan from '../../assets/icons/icon-sipangan-removebg-preview.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ username, password });
      
      if (response.data?.accessToken) {
        const { accessToken, refreshToken } = response.data;
        
        // Get role and fullname from response body or decode from JWT
        let role = response.data.role;
        let fullname = response.data.fullname;
        
        if (!role || !fullname) {
          try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            if (!role) role = payload.role || 'operator';
            if (!fullname) fullname = payload.fullname || payload.username || 'Administrator';
          } catch (e) {
            console.error('Failed to decode token:', e);
            if (!role) role = 'operator';
            if (!fullname) fullname = 'Administrator';
          }
        }

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userFullname', fullname);
        
        if (role === 'super_admin' || role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/admin/manage');
        }
      } else {
        setError('Respons server tidak valid.');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal terhubung ke server.';
      if (err.response?.status === 401) {
        setError('Kredensial tidak valid. Silakan periksa kembali username dan password Anda.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6 text-gray-100 relative overflow-hidden font-sans">
      {/* Ambient Radial Glow Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.08),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_80%,rgba(16,185,129,0.08),transparent_40%)]"></div>
        
        {/* Futuristic dot matrix background pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        ></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Main Glassmorphic Card */}
        <div className="bg-[#030712]/75 backdrop-blur-3xl border border-white/[0.06] rounded-[2.25rem] shadow-2xl p-8 sm:p-10 relative overflow-hidden group">
          
          {/* Top subtle decorative color bar */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          {/* Secure link pill indicator */}
          <div className="absolute top-6 right-8 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[8px] font-black text-emerald-400/90 tracking-widest uppercase">SECURE PORTAL</span>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-all mb-8 group/back cursor-pointer"
          >
            <span className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover/back:bg-emerald-500/10 group-hover/back:border-emerald-500/20 group-hover/back:text-emerald-400 transition-all duration-300">
              <ArrowLeft size={14} className="group-hover/back:-translate-x-0.5 transition-transform" />
            </span>
            <span>Kembali</span>
          </button>
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center gap-4 mb-8 relative">
            <div className="absolute -z-10 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl opacity-60"></div>
            <div className="relative p-2.5 rounded-3xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-md shadow-inner group/logo cursor-pointer transition-all duration-500 hover:border-emerald-500/20 hover:shadow-emerald-500/5">
              <img 
                src={iconSipangan} 
                alt="Sipangan Logo" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain transition-all duration-700 ease-out group-hover/logo:scale-105 group-hover/logo:rotate-3" 
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none mb-1.5">
                SIPANGAN
              </h1>
              <p className="text-[9px] font-black text-emerald-500/80 uppercase tracking-[0.25em] mt-1">
                Portal Akses Administrator
              </p>
            </div>
          </div>

          {/* Alert Error Messages with Enter animation */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold flex items-start gap-3 shadow-[0_4px_12px_rgba(239,68,68,0.05)]"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Username
              </label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${usernameFocused ? 'text-emerald-400' : 'text-gray-500'}`}>
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => setUsernameFocused(false)}
                  className={`w-full bg-white/[0.02] border rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none transition-all duration-300 placeholder:text-gray-600 font-medium ${
                    usernameFocused 
                      ? 'border-emerald-500/40 bg-white/[0.05] shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                      : 'border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.03]'
                  }`}
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${passwordFocused ? 'text-emerald-400' : 'text-gray-500'}`}>
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className={`w-full bg-white/[0.02] border rounded-2xl pl-12 pr-12 py-4 text-white focus:outline-none transition-all duration-300 placeholder:text-gray-600 font-medium ${
                    passwordFocused 
                      ? 'border-emerald-500/40 bg-white/[0.05] shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                      : 'border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.03]'
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full relative group mt-6 overflow-hidden rounded-2xl cursor-pointer border-0 p-0"
            >
              {/* Pulsing button shadow */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-[2px]" />
              
              {/* Actual button core */}
              <div className="relative w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#020617] font-extrabold uppercase tracking-widest text-[11px] rounded-2xl px-6 py-4 flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.35)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Shield size={15} className="text-[#020617]" />
                    <span>Masuk Sekarang</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer Branding */}
          <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.25em]">
              © 2026 SIPANGAN TECHNOLOGY • V1.0.4
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
