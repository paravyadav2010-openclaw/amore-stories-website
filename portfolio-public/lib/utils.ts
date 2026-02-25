import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Animation constants for Framer Motion
export const ANIMATION_CONFIG = {
  duration: 0.6,
  easing: [0.16, 1, 0.3, 1] as const, // Cubic-bezier for "snappy but smooth"
  staggerDelay: 0.1,
} as const

// Variant presets
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.duration,
      ease: ANIMATION_CONFIG.easing,
    },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_CONFIG.duration,
      ease: ANIMATION_CONFIG.easing,
    },
  },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: ANIMATION_CONFIG.staggerDelay,
    },
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_CONFIG.duration,
      ease: ANIMATION_CONFIG.easing,
    },
  },
}
