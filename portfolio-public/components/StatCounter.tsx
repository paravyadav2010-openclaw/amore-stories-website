'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface StatCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export default function StatCounter({ value, suffix = '', duration = 2 }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true);

      let startTimestamp: number;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(value * easeOutQuart));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(value);
        }
      };

      window.requestAnimationFrame(step);
    }
  }, [isInView, isVisible, value, duration]);

  return (
    <div ref={ref} className="flex items-baseline justify-center gap-1">
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold text-white"
      >
        {count}
      </motion.span>
      {suffix && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: duration, duration: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-purple-400"
        >
          {suffix}
        </motion.span>
      )}
    </div>
  );
}
