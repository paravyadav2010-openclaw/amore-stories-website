'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState, useMemo } from 'react';

interface ProgressCircleProps {
  value: number;
  label: string;
  color?: 'purple' | 'pink' | 'cyan' | 'blue';
  icon?: React.ReactNode;
}

const colorMap = {
  purple: '#667eea',
  pink: '#f093fb',
  cyan: '#00f2fe',
  blue: '#4facfe',
};

const colorGradients = {
  purple: ['#667eea', '#764ba2'],
  pink: ['#f093fb', '#f5576c'],
  cyan: ['#4facfe', '#00f2fe'],
  blue: ['#4facfe', '#00c6ff'],
};

export default function ProgressCircle({ value, label, color = 'purple', icon }: ProgressCircleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const circumference = 2 * Math.PI * 54; // radius = 54
  const strokeDashoffset = useMemo(
    () => circumference - (isVisible ? value / 100 : 0) * circumference,
    [circumference, value, isVisible]
  );

  return (
    <div ref={ref} className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mb-4"
      >
        {/* Background circle */}
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="54"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="64"
            cy="64"
            r="54"
            stroke={`url(#gradient-${color})`}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ strokeDasharray: circumference }}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorGradients[color][0]} />
              <stop offset="100%" stopColor={colorGradients[color][1]} />
            </linearGradient>
          </defs>
        </svg>

        {/* Icon in center */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isVisible ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${colorMap[color]}20` }}
          >
            <div style={{ color: colorMap[color] }}>{icon}</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1 }}
          className="text-2xl font-bold text-white mb-1"
          style={{ color: colorMap[color] }}
        >
          {value}%
        </motion.p>
        <p className="text-sm font-medium text-gray-300">{label}</p>
      </motion.div>
    </div>
  );
}
