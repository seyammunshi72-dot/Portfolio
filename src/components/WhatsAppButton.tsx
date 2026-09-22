import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../lib/store';
import { getWhatsAppChatUrl } from '../lib/socialUtils';

export default function WhatsAppButton() {
  const { settings } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = getWhatsAppChatUrl(settings.whatsappNumber);

  return (
    <div 
      id="floating-whatsapp-container"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Tooltip Pill (Desktop) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden md:flex items-center gap-2 mr-3 px-3.5 py-2 rounded-full bg-[#141414]/95 backdrop-blur-md border border-white/15 text-white shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
              Chat with Seyam
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Button */}
      <motion.a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Seyam on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_36px_rgba(37,211,102,0.65)] transition-all duration-300 border border-white/25"
      >
        {/* Radar Pulse Effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none group-hover:opacity-40" />

        {/* WhatsApp Official Vector Icon */}
        <svg 
          className="w-7 h-7 sm:w-8 sm:h-8 relative z-10 drop-shadow-sm" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <path
            fill="white"
            d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z"
          />
          <path
            fill="#25D366"
            d="M17.52 14.33C17.22 14.18 15.75 13.45 15.47 13.35C15.2 13.25 15 13.2 14.81 13.5C14.61 13.8 14.05 14.47 13.88 14.66C13.71 14.86 13.53 14.88 13.24 14.73C12.94 14.58 11.99 14.27 10.87 13.27C9.99 12.49 9.4 11.52 9.23 11.23C9.06 10.93 9.21 10.77 9.36 10.63C9.49 10.5 9.66 10.28 9.8 10.11C9.95 9.94 10 9.82 10.1 9.62C10.2 9.42 10.15 9.25 10.08 9.1C10 8.95 9.43 7.55 9.2 6.98C8.97 6.43 8.74 6.51 8.57 6.5C8.41 6.49 8.22 6.49 8.03 6.49C7.84 6.49 7.52 6.56 7.26 6.84C6.99 7.13 6.25 7.82 6.25 9.22C6.25 10.62 7.27 11.97 7.42 12.16C7.56 12.36 9.45 15.27 12.35 16.52C13.04 16.82 13.58 17 14 17.13C14.69 17.35 15.31 17.32 15.81 17.25C16.36 17.17 17.51 16.55 17.75 15.87C17.99 15.19 17.99 14.61 17.92 14.49C17.85 14.36 17.67 14.29 17.52 14.33Z"
          />
        </svg>
      </motion.a>
    </div>
  );
}
