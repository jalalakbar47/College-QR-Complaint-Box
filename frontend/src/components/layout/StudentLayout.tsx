import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { pageTransitionVariants, usePrefersReducedMotion, getMotionVariant } from '../../lib/motion';

export const StudentLayout: React.FC = () => {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const variants = getMotionVariant(pageTransitionVariants, prefersReducedMotion);

  return (
    <div
      className="min-h-screen flex flex-col bg-paper text-ink-navy"
      style={{ backgroundColor: '#EAEDF3' }}
    >
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};
