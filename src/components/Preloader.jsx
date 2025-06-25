import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onAnimationComplete }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onAnimationComplete();
    }, 1400); // 1.4s preloader
    return () => clearTimeout(timerRef.current);
  }, [onAnimationComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700"
      >
        <motion.img
          src="/banner.jpg"
          alt="Cresen Ventures Banner"
          className="h-36 w-auto rounded-2xl shadow-2xl mb-10 border-4 border-neutral-700"
          style={{ zIndex: 1, objectFit: 'cover', maxWidth: '600px', filter: 'brightness(0.96) contrast(1.08)' }}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-12 h-12 border-4 border-neutral-300 border-t-primary rounded-full animate-spin shadow-lg"></div>
          <div className="absolute w-6 h-6 rounded-full bg-primary opacity-60 animate-pulse"></div>
        </div>
        <span className="text-base font-semibold text-neutral-100 tracking-wide mt-2 drop-shadow-lg">
          Elevating Thermal Paper Solutions
        </span>
        <span className="text-xs font-medium text-neutral-300 tracking-wide mt-1 opacity-80">
          Loading Cresen Ventures...
        </span>
      </motion.div>
    </AnimatePresence>
  );
};

export default Preloader;
