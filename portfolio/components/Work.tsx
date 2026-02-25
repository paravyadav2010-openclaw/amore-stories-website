'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ExternalLink, Filter, X, Github, ChevronRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import ProjectModal from './ProjectModal';
import TiltCard from './TiltCard';
import GradientText from './GradientText';

export default function Work() {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const projects = [
    {
      id: 1,
      title: 'Avatar: The Way of Water',
      category: 'films',
      year: '2022',
      description: 'Senior Rotoscope Artist on James Cameron\'s groundbreaking sequel. Led a team of artists creating seamless rotoscope work for underwater sequences and complex creature interactions.',
      tech: ['Nuke', 'Silhouette', 'Python', 'Houdini'],
      image: '/placeholder-avatar.jpg',
      featured: true,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      title: 'Portfolio Website',
      category: 'web',
      year: '2024',
      description: 'Full-stack portfolio website built with Next.js 14, featuring dynamic particle backgrounds, interactive 3D elements, and smooth animations using Framer Motion.',
      tech: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'TypeScript'],
      image: '/placeholder-portfolio.jpg',
      featured: false,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 3,
      title: 'VFX Pipeline Automation',
      category: 'web',
      year: '2023',
      description: 'Custom Python automation tools for Weta FX\'s rotoscope pipeline, reducing manual work by 60% and improving consistency across shot sequences.',
      tech: ['Python', 'PyQt', 'Nuke API', 'Git', 'Docker'],
      image: '/placeholder-pipeline.jpg',
      featured: false,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 4,
      title: 'The Batman',
      category: 'films',
      year: '2022',
      description: 'Key rotoscope artist working on complex action sequences and dark atmospheric shots, ensuring clean plates for compositing.',
      tech: ['Nuke', 'Silhouette', 'Mocha Pro'],
      image: '/placeholder-batman.jpg',
      featured: true,
      color: 'from-gray-700 to-gray-900',
    },
    {
      id: 5,
      title: 'AI-Powered Rotoscope Tool',
      category: 'web',
      year: '2024',
      description: 'Experimental tool using machine learning to automate initial rotoscope masks, with manual refinement capabilities for artists.',
      tech: ['Python', 'TensorFlow', 'OpenCV', 'React', 'FastAPI'],
      image: '/placeholder-ai-tool.jpg',
      featured: false,
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 6,
      title: 'Dune: Part Two',
      category: 'films',
      year: '2024',
      description: 'Contributed to sweeping desert sequences and sand worm interactions, handling complex motion blur and depth challenges.',
      tech: ['Nuke', 'Silhouette', 'Mocha Pro'],
      image: '/placeholder-dune.jpg',
      featured: true,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'films', label: 'Films' },
    { id: 'web', label: 'Web' },
  ];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <section id="work" className="section-padding relative">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="orb orb-blue w-[400px] h-[400px]"
          style={{ top: '10%', right: '-100px' }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="orb orb-purple w-[300px] h-[300px]"
          style={{ bottom: '20%', left: '-50px' }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
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
            Portfolio
          </motion.span>
          <h2 className="heading-section text-white mb-4">
            Featured <GradientText gradient="primary">Work</GradientText>
          </h2>
          <p className="text-body text-gray-400 max-w-2xl mx-auto">
            A selection of my VFX projects and development work, showcasing the intersection of art and technology
          </p>
        </AnimatedSection>

        {/* Filter Buttons */}
        <AnimatedSection delay={0.1} className="mb-12">
          <div className="flex justify-center">
            <div className="glass-strong rounded-2xl p-2 inline-flex gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-8 py-3 rounded-xl font-medium transition-all relative overflow-hidden
                    ${filter === category.id
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                    }
                  `}
                >
                  {filter === category.id && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Masonry Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setSelectedProject(project)}
              >
                <TiltCard className="glass-card h-full cursor-pointer group">
                  {/* Image/Preview */}
                  <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gradient-to-br ${project.color}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-500">
                        {project.category === 'films' ? '🎬' : '💻'}
                      </span>
                    </div>

                    {/* Featured badge */}
                    {project.featured && (
                      <div className="absolute top-4 left-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white"
                        >
                          Featured
                        </motion.div>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 backdrop-blur-md rounded-xl text-white font-medium border border-white/20"
                        >
                          View Details <ChevronRight size={16} />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-2">
                    <div className="flex items-center gap-2 mb-3">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white rounded-full bg-gradient-to-r ${project.color}`}
                      >
                        {project.category}
                      </motion.span>
                      <span className="text-xs text-gray-500">{project.year}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {project.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.slice(0, 3).map((tech, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ y: -2 }}
                          className="px-2 py-1 text-xs glass rounded-md text-gray-300"
                        >
                          {tech}
                        </motion.span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="px-2 py-1 text-xs text-purple-400 font-medium">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View More Button */}
        <AnimatedSection delay={0.3} className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-glass inline-flex items-center gap-2 px-8 py-4"
          >
            View All Projects <Github size={18} />
          </motion.button>
        </AnimatedSection>
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject || {
          title: '',
          description: '',
          category: '',
          year: '',
          tech: [],
        }}
      />
    </section>
  );
}
