'use client';

import { motion } from 'framer-motion';
import { Briefcase, Award, Target, Zap, Calendar, CheckCircle } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import StatCounter from './StatCounter';
import GradientText from './GradientText';

const timeline = [
  {
    year: '2024',
    title: 'Senior Rotoscope Artist',
    company: 'Weta FX',
    description: 'Leading team on major film projects, implementing pipeline improvements and mentoring junior artists.',
    icon: <Award className="w-6 h-6" />,
  },
  {
    year: '2021',
    title: 'Rotoscope Artist',
    company: 'Weta FX',
    description: 'Contributed to blockbuster films including Avatar: The Way of Water and Dune: Part Two.',
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    year: '2019',
    title: 'Junior Rotoscope Artist',
    company: 'Method Studios',
    description: 'Started career working on commercials and TV series, developed strong rotoscope fundamentals.',
    icon: <Target className="w-6 h-6" />,
  },
  {
    year: '2017',
    title: 'Started Learning VFX',
    company: 'Self-Directed',
    description: 'Began journey into visual effects, learning Nuke and roto techniques through online courses.',
    icon: <Zap className="w-6 h-6" />,
  },
];

const stats = [
  { value: 7, label: 'Years Experience', suffix: '+' },
  { value: 20, label: 'Major Films', suffix: '+' },
  { value: 15, label: 'Awards Nominations', suffix: '' },
  { value: 100, label: 'Team Size Led', suffix: '+' },
];

export default function About() {
  return (
    <section id="about" className="section-padding relative">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="orb orb-cyan w-[500px] h-[500px]"
          style={{ top: '20%', left: '-100px' }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <motion.div
          className="orb orb-purple w-[400px] h-[400px]"
          style={{ bottom: '10%', right: '-80px' }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, delay: 3 }}
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
            About Me
          </motion.span>
          <h2 className="heading-section text-white mb-4">
            My <GradientText gradient="primary">Journey</GradientText>
          </h2>
          <p className="text-body text-gray-400 max-w-2xl mx-auto">
            From passionate learner to industry professional, my path in visual effects and development
          </p>
        </AnimatedSection>

        {/* Animated Stats */}
        <AnimatedSection delay={0.1} className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card p-6 text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
                >
                  <Calendar className="w-8 h-8 text-white" />
                </motion.div>
                <StatCounter value={stat.value} suffix={stat.suffix} />
                <p className="text-sm text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Timeline */}
        <AnimatedSection delay={0.2} className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-500" />

              {/* Timeline items */}
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline dot */}
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50 z-10 pulse-glow"
                    />

                    {/* Content */}
                    <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'} ml-16 md:ml-0`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-card p-6 timeline-item relative"
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.15 + 0.2 }}
                          className="w-12 h-12 mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center"
                        >
                          <div className="text-purple-400">{item.icon}</div>
                        </motion.div>
                        <motion.span
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.15 + 0.3 }}
                          className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 rounded-full mb-2"
                        >
                          {item.year}
                        </motion.span>
                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-purple-400 font-semibold mb-3">{item.company}</p>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Skills & Capabilities */}
        <AnimatedSection delay={0.3}>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left side - Photo placeholder with animated border */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-6"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="text-8xl opacity-50"
                  >
                    👨‍💻
                  </motion.div>
                </div>

                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 border-2 border-transparent rounded-2xl"
                  animate={{
                    borderColor: [
                      'rgba(102, 126, 234, 0.5)',
                      'rgba(240, 147, 251, 0.5)',
                      'rgba(79, 172, 254, 0.5)',
                      'rgba(102, 126, 234, 0.5)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>

              <h3 className="text-xl font-bold text-white mb-3">Praveen Kumar</h3>
              <p className="text-gray-400 mb-4">
                Passionate about creating stunning visual effects and building innovative digital solutions. I thrive at the intersection of art and technology.
              </p>
            </motion.div>

            {/* Right side - Capabilities */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <h3 className="heading-sub text-white mb-6">
                <GradientText gradient="accent">Core Capabilities</GradientText>
              </h3>

              <div className="space-y-4">
                {[
                  'Advanced roto and paint techniques',
                  'Team leadership and mentoring',
                  'Pipeline automation and optimization',
                  'Full-stack web development',
                  'AI/ML integration in VFX workflows',
                  'Cross-functional collaboration',
                ].map((capability, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                    className="flex items-start gap-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                    <p className="text-gray-300">{capability}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
