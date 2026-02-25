'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Palette, Terminal, Database, Zap, Monitor, Cpu, Layout, Layers } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import ProgressCircle from './ProgressCircle';
import GradientText from './GradientText';

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('vfx');

  const skills = {
    vfx: [
      { name: 'Nuke', level: 95, icon: <Terminal className="w-5 h-5" /> },
      { name: 'Silhouette', level: 90, icon: <Palette className="w-5 h-5" /> },
      { name: 'Mocha Pro', level: 85, icon: <Monitor className="w-5 h-5" /> },
      { name: 'Houdini', level: 75, icon: <Zap className="w-5 h-5" /> },
    ],
    tech: [
      { name: 'Python', level: 90, icon: <Code className="w-5 h-5" /> },
      { name: 'React/Next.js', level: 85, icon: <Layout className="w-5 h-5" /> },
      { name: 'TypeScript', level: 80, icon: <Terminal className="w-5 h-5" /> },
      { name: 'Node.js', level: 75, icon: <Database className="w-5 h-5" /> },
      { name: 'PostgreSQL', level: 70, icon: <Database className="w-5 h-5" /> },
      { name: 'Docker', level: 65, icon: <Cpu className="w-5 h-5" /> },
    ],
    design: [
      { name: 'UI/UX Design', level: 75, icon: <Layout className="w-5 h-5" /> },
      { name: 'Motion Graphics', level: 80, icon: <Layers className="w-5 h-5" /> },
      { name: '3D Modeling', level: 65, icon: <Monitor className="w-5 h-5" /> },
      { name: 'Color Grading', level: 85, icon: <Palette className="w-5 h-5" /> },
    ],
  };

  const skillIcons = {
    vfx: <Palette className="w-6 h-6" />,
    tech: <Code className="w-6 h-6" />,
    design: <Layout className="w-6 h-6" />,
  };

  const categoryColors = {
    vfx: 'from-pink-600 to-red-600',
    tech: 'from-purple-600 to-indigo-600',
    design: 'from-cyan-600 to-blue-600',
  };

  const categoryGradients = {
    vfx: 'pink',
    tech: 'purple',
    design: 'cyan',
  };

  return (
    <section id="skills" className="section-padding relative">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="orb orb-pink w-[500px] h-[500px]"
          style={{ top: '-100px', left: '20%' }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="orb orb-cyan w-[400px] h-[400px]"
          style={{ bottom: '-100px', right: '10%' }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, delay: 3 }}
        />
      </div>

      <div className="section-container relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 text-sm font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 rounded-full mb-6"
          >
            Expertise
          </motion.span>
          <h2 className="heading-section text-white mb-4">
            Skills & <GradientText gradient="primary">Capabilities</GradientText>
          </h2>
          <p className="text-body text-gray-400 max-w-2xl mx-auto">
            A unique blend of creative artistry and technical proficiency
          </p>
        </AnimatedSection>

        {/* Category Tabs */}
        <AnimatedSection delay={0.1} className="mb-12">
          <div className="flex justify-center flex-wrap gap-3">
            {Object.keys(skills).map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-8 py-4 rounded-2xl font-medium transition-all flex items-center gap-3 relative overflow-hidden
                  ${activeCategory === category
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="activeCategory"
                    className={`absolute inset-0 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} rounded-2xl`}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  {skillIcons[category as keyof typeof skillIcons]}
                  <span className="capitalize">{category}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </AnimatedSection>

        {/* Skills Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16"
          >
            {skills[activeCategory as keyof typeof skills].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-center"
              >
                <ProgressCircle
                  value={skill.level}
                  label={skill.name}
                  color={categoryGradients[activeCategory as keyof typeof categoryGradients] as any}
                  icon={skill.icon}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Additional Skills Tags */}
        <AnimatedSection delay={0.3} className="mb-16">
          <div className="glass-strong rounded-3xl p-10">
            <h3 className="heading-sub text-white mb-8 text-center">
              <GradientText gradient="accent">Additional Technologies</GradientText>
            </h3>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Git', 'GitHub', 'Linux', 'AWS', 'Vercel',
                'REST APIs', 'GraphQL', 'FastAPI', 'Flask',
                'Tailwind CSS', 'Framer Motion', 'Three.js',
                'CI/CD', 'Agile', 'JIRA', 'Slack', 'Docker',
                'Kubernetes', 'MongoDB', 'Redis', 'Nginx',
              ].map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 glass rounded-full text-sm text-gray-300 hover:text-white hover:border-purple-500/50 transition-all cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Experience Levels */}
        <AnimatedSection delay={0.4}>
          <div className="grid md:grid-cols-3 gap-6">
            {/* VFX Experience */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card p-8 text-center"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-red-500 rounded-3xl flex items-center justify-center shadow-lg shadow-pink-500/30"
              >
                <Palette className="w-10 h-10 text-white" />
              </motion.div>
              <h4 className="text-xl font-bold text-white mb-3">VFX Artistry</h4>
              <p className="text-lg text-pink-400 font-semibold mb-4">7+ Years</p>
              <p className="text-sm text-gray-400 mb-6">Film & TV Production</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Film', 'TV', 'Commercial', 'Animation'].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 text-xs bg-pink-500/20 text-pink-400 rounded-lg font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Development Experience */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card p-8 text-center"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-500/30"
              >
                <Code className="w-10 h-10 text-white" />
              </motion.div>
              <h4 className="text-xl font-bold text-white mb-3">Development</h4>
              <p className="text-lg text-purple-400 font-semibold mb-4">3+ Years</p>
              <p className="text-sm text-gray-400 mb-6">Full-Stack Engineering</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Full-Stack', 'Automation', 'Tools', 'AI/ML'].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 text-xs bg-purple-500/20 text-purple-400 rounded-lg font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Leadership Experience */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card p-8 text-center"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <Zap className="w-10 h-10 text-white" />
              </motion.div>
              <h4 className="text-xl font-bold text-white mb-3">Leadership</h4>
              <p className="text-lg text-cyan-400 font-semibold mb-4">Team Lead</p>
              <p className="text-sm text-gray-400 mb-6">Project Management</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Mentoring', 'Pipeline', 'Quality', 'Agile'].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-lg font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
