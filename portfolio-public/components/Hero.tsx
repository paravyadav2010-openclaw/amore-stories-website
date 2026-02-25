'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import MagneticButton from './MagneticButton';

export default function Hero() {
  // Animated text variants for letter-by-letter reveal
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const name = "Praveen Kumar";
  const letters = name.split('');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient orbs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Purple orb */}
        <motion.div
          className="orb orb-purple w-[600px] h-[600px]"
          style={{
            top: '-200px',
            left: '-200px',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Pink orb */}
        <motion.div
          className="orb orb-pink w-[500px] h-[500px]"
          style={{
            bottom: '-150px',
            right: '-150px',
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* Blue orb */}
        <motion.div
          className="orb orb-blue w-[400px] h-[400px]"
          style={{
            top: '30%',
            right: '10%',
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />

        {/* Cyan orb */}
        <motion.div
          className="orb orb-cyan w-[350px] h-[350px]"
          style={{
            bottom: '20%',
            left: '15%',
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1.3, 1, 1.3],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 6,
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Greeting badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">
                Welcome to my creative universe
              </span>
            </motion.div>
          </motion.div>

          {/* Main heading with letter-by-letter animation */}
          <motion.h1
            className="heading-display text-white mb-6 flex justify-center"
            initial="hidden"
            animate="visible"
          >
            I'm{' '}
            <span className="gradient-text ml-4 glow-text">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  transition={{
                    delay: index * 0.08,
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
          >
            Senior <span className="text-purple-400 font-semibold glow-text">Rotoscope Artist</span> @ Weta FX
            <br />
            Bridging <span className="gradient-text">VFX</span> and{' '}
            <span className="gradient-text" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Code</span>
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.8 }}
            className="text-body text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Crafting cinematic magic through visual effects and building innovative digital solutions.
            7+ years of experience transforming creative vision into reality.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="flex flex-wrap gap-4 justify-center mb-16"
          >
            <MagneticButton
              variant="primary"
              className="btn-glow"
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View My Work
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              className="btn-glass"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </MagneticButton>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            className="flex justify-center gap-4"
          >
            {[
              { icon: Github, href: 'https://github.com/TraderParav' },
              { icon: Linkedin, href: 'https://linkedin.com/in/praveenkumarnz' },
              { icon: Mail, href: 'mailto:praveenkumar.nz@gmail.com' },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 glass rounded-full border-glow group"
              >
                <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 scroll-indicator"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <ArrowDown className="text-white/60" size={24} />
      </motion.div>

      {/* Decorative floating elements */}
      <motion.div
        className="absolute top-20 right-20 w-3 h-3 rounded-full bg-purple-500 opacity-30"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-32 left-24 w-2 h-2 rounded-full bg-pink-500 opacity-40"
        animate={{
          y: [0, 40, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/3 left-16 w-2 h-2 rounded-full bg-cyan-500 opacity-30"
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </section>
  );
}
