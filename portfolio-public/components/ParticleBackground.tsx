'use client';

import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const particleCount = 150; // Increased particle count
    const connectionDistance = 180;
    const mouseDistance = 250;

    let mouseX = 0;
    let mouseY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      opacity: number;
      pulseSpeed: number;
      pulsePhase: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;

        const colors = [
          { r: 102, g: 126, b: 234 }, // Purple
          { r: 240, g: 147, b: 251 }, // Pink
          { r: 79, g: 172, b: 254 },  // Blue
          { r: 0, g: 242, b: 254 },    // Cyan
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        this.color = `rgba(${color.r}, ${color.g}, ${color.b}`;
      }

      update() {
        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseDistance) {
          const force = (mouseDistance - distance) / mouseDistance;
          const angle = Math.atan2(dy, dx);
          this.vx -= Math.cos(angle) * force * 0.03;
          this.vy -= Math.sin(angle) * force * 0.03;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Boundary check with bounce
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Velocity damping
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Minimum velocity to keep particles moving
        const minVel = 0.2;
        if (Math.abs(this.vx) < minVel) this.vx *= 1.02;
        if (Math.abs(this.vy) < minVel) this.vy *= 1.02;

        // Update pulse phase
        this.pulsePhase += this.pulseSpeed;
      }

      draw() {
        const currentOpacity = this.opacity * (0.7 + Math.sin(this.pulsePhase) * 0.3);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}, ${currentOpacity})`;
        ctx.fill();

        // Glow effect
        const glowSize = this.size * 3;
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, glowSize
        );
        gradient.addColorStop(0, `${this.color}, ${currentOpacity * 0.5})`);
        gradient.addColorStop(1, `${this.color}, 0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Draw connections between particles
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    // Animate background gradient
    let gradientPhase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw dynamic gradient background
      gradientPhase += 0.005;
      const gradient = ctx.createRadialGradient(
        canvas.width / 2 + Math.sin(gradientPhase) * 200,
        canvas.height / 2 + Math.cos(gradientPhase) * 200,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 1.5
      );

      // Create shifting color stops for gradient
      const t1 = (Math.sin(gradientPhase) + 1) / 2;
      const t2 = (Math.cos(gradientPhase) + 1) / 2;

      gradient.addColorStop(0, `rgba(102, 126, 234, ${0.05 + t1 * 0.03})`);
      gradient.addColorStop(0.4, `rgba(240, 147, 251, ${0.03 + t2 * 0.02})`);
      gradient.addColorStop(0.7, `rgba(79, 172, 254, ${0.02 + t1 * 0.02})`);
      gradient.addColorStop(1, 'rgba(0, 242, 254, 0.01)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      drawConnections();

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Handle touch events for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}
