import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  gradient?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

const gradientClasses = {
  primary: 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500',
  secondary: 'bg-gradient-to-r from-pink-500 to-rose-500',
  accent: 'bg-gradient-to-r from-cyan-500 to-blue-500',
};

export default function GradientText({ children, gradient = 'primary', className = '' }: GradientTextProps) {
  return (
    <span className={`bg-clip-text text-transparent ${gradientClasses[gradient]} ${className}`}>
      {children}
    </span>
  );
}
