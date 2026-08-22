import { Variants, Transition, useReducedMotion } from 'framer-motion';

/**
 * Standard Motion Tokens
 * Purposeful, fast, quiet motion for institutional grievance management.
 * Philosophy: Motion communicates state changes and guides attention, never decorates.
 */
export const MOTION_DURATIONS = {
  instant: 0.1, // 100ms - press/tap feedback
  fast: 0.2,    // 200ms - hover/focus, toggles, modal exit
  base: 0.3,    // 300ms - reveals, modals entering, route transitions
  fill: 0.4,    // 400ms - progress bar sweeps
  slow: 0.45,   // 450ms - large section entrances
  countUp: 0.6, // 600ms - dashboard metric count-up
} as const;

export const MOTION_EASINGS = {
  easeOutQuart: [0.16, 1, 0.3, 1] as [number, number, number, number], // reveals and entrances
  standardEase: [0.4, 0, 0.2, 1] as [number, number, number, number],   // hover/color transitions
  linear: [0, 0, 1, 1] as [number, number, number, number],             // progress fills & countdowns
} as const;

/**
 * Global Route / Content Transition
 * 8px subtle slide up with fade (300ms enter, 200ms exit)
 */
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.base,
      ease: MOTION_EASINGS.easeOutQuart,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.standardEase,
    },
  },
};

/**
 * Section & Card Fade Up Entrance
 */
export const fadeUpVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.base,
      ease: MOTION_EASINGS.easeOutQuart,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.standardEase,
    },
  },
};

/**
 * Pure Fade In / Out
 */
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.standardEase,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: MOTION_DURATIONS.instant,
      ease: MOTION_EASINGS.standardEase,
    },
  },
};

/**
 * Modal & Dialog Scale-In
 * 0.96 -> 1.0 (300ms in, 200ms exit)
 */
export const modalScaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: MOTION_DURATIONS.base,
      ease: MOTION_EASINGS.easeOutQuart,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.standardEase,
    },
  },
};

/**
 * Slide-Over Drawer Panel (from Right)
 * 300ms entering, 200ms exiting
 */
export const slideOverVariants: Variants = {
  initial: { opacity: 0, x: '100%' },
  animate: {
    opacity: 1,
    x: '0%',
    transition: {
      duration: MOTION_DURATIONS.base,
      ease: MOTION_EASINGS.easeOutQuart,
    },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.standardEase,
    },
  },
};

/**
 * TicketStub Success State Scale-In
 * 0.96 -> 1.0 (350ms easeOutQuart)
 */
export const ticketStubEntranceVariants: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: MOTION_EASINGS.easeOutQuart,
    },
  },
};

/**
 * Status Pill Pulse Variant
 * Single brief opacity / scale pulse (1 -> 1.05 -> 1)
 */
export const pillPulseVariants: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: MOTION_DURATIONS.base,
      ease: MOTION_EASINGS.standardEase,
    },
  },
};

/**
 * Stagger Container Factory
 * Capped children stagger (40-60ms apart)
 */
export const createStaggerContainer = (
  staggerDelay = 0.045,
  delayChildren = 0.02
): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: delayChildren,
    },
  },
});

export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: MOTION_EASINGS.easeOutQuart,
    },
  },
};

/**
 * Input Error Horizontal Shake (200ms)
 * 2-3px horizontal shake on border only
 */
export const inputErrorShakeTransition: Transition = {
  duration: MOTION_DURATIONS.fast,
  ease: MOTION_EASINGS.standardEase,
};

export const inputShakeKeyframes = [0, -3, 3, -2, 2, 0];

/**
 * Clickable Card Lift Transition (Transform only, 2px lift)
 */
export const clickableCardMotion = {
  whileHover: {
    y: -2,
    transition: { duration: 0.15, ease: MOTION_EASINGS.standardEase },
  },
  whileTap: {
    scale: 0.99,
    transition: { duration: MOTION_DURATIONS.instant },
  },
};

/**
 * Icon Button Tap Feedback (Scale to 0.95 on press, no hover lift)
 */
export const iconButtonTapMotion = {
  whileTap: {
    scale: 0.95,
    transition: { duration: MOTION_DURATIONS.instant },
  },
};

/**
 * Viewport Scroll Reveal Settings (Public Pages Only)
 * Threshold 0.2, trigger once
 */
export const scrollRevealProps = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: {
    duration: MOTION_DURATIONS.base,
    ease: MOTION_EASINGS.easeOutQuart,
  },
};

/**
 * Helper hook to get reduced motion preference
 */
export function usePrefersReducedMotion(): boolean {
  const shouldReduce = useReducedMotion();
  return Boolean(shouldReduce);
}

/**
 * Helper to produce reduced-motion safe variants
 */
export function getMotionVariant(variant: Variants, prefersReducedMotion: boolean): Variants {
  if (!prefersReducedMotion) return variant;

  // Fallback to instant, no-transform, opacity-only
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.01 } },
    exit: { opacity: 0, transition: { duration: 0.01 } },
  };
}
