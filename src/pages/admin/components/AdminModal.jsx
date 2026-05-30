import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const AdminModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Full-screen scroll container */}
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Centering wrapper */}
        <div className="flex items-center justify-center min-h-full px-4 py-10">
          {/* Modal Card — NO overflow-hidden so dropdowns render freely */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800/80 rounded-t-2xl">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6">
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default AdminModal;
