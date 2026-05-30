import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, XCircle, Info, X } from 'lucide-react';

const CustomAlert = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'info', // info, success, error, warning
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirm = false 
}) => {
  const icons = {
    info: <Info className="text-blue-400" size={24} />,
    success: <CheckCircle2 className="text-emerald-400" size={24} />,
    error: <XCircle className="text-red-400" size={24} />,
    warning: <AlertCircle className="text-amber-400" size={24} />,
  };

  const colors = {
    info: 'border-blue-500/20 bg-blue-500/5',
    success: 'border-emerald-500/20 bg-emerald-500/5',
    error: 'border-red-500/20 bg-red-500/5',
    warning: 'border-amber-500/20 bg-amber-500/5',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-[360px] border rounded-2xl p-5 sm:p-6 shadow-2xl overflow-hidden ${colors[type]} border-white/10 backdrop-blur-xl bg-gray-900/90`}
          >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`p-2.5 rounded-xl mb-3.5 ${type === 'success' ? 'bg-emerald-500/10' : type === 'error' ? 'bg-red-500/10' : type === 'warning' ? 'bg-amber-500/10' : 'bg-white/5'}`}>
                {icons[type]}
              </div>

              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider mb-1.5">
                {title}
              </h3>
              
              <p className="text-gray-400 text-xs sm:text-sm font-medium leading-relaxed mb-5">
                {message}
              </p>

              <div className="flex items-center gap-2.5 w-full">
                {isConfirm && (
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold uppercase tracking-wider text-[11px] transition-all border border-white/5"
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (isConfirm && onConfirm) {
                      onConfirm();
                    } else {
                      onClose();
                    }
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all shadow-lg
                    ${type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 
                      type === 'error' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 
                      type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' :
                      'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'} text-white`}
                >
                  {confirmText}
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomAlert;
