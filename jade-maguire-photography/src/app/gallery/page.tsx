'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

const galleryImages = [
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2025/02/Hannah-and-James-704-682x1024.jpg',
    alt: 'Hannah and James wedding',
    width: 682,
    height: 1024,
    category: 'Manchester',
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2023/06/EmsMatt-15-1024x683.jpg',
    alt: 'Confetti moment',
    width: 1024,
    height: 683,
    category: 'Sheffield',
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2024/09/Hannah-and-James-5-1024x683.jpg',
    alt: 'Victoria Baths wedding',
    width: 1024,
    height: 683,
    category: 'Manchester',
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2024/08/Amanda-and-Mike-82-683x1024.jpg',
    alt: 'Festival wedding',
    width: 683,
    height: 1024,
    category: 'Wales',
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2025/05/DA-345-682x1024.jpg',
    alt: 'Love Lane Brewery wedding',
    width: 682,
    height: 1024,
    category: 'Liverpool',
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2023/07/Noosh-and-Christian-17-1024x712.jpg',
    alt: 'Alternative wedding',
    width: 1024,
    height: 712,
    category: 'Cambridge',
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2023/07/Sarah-and-Chris-6-1024x683.jpg',
    alt: 'Sefton church wedding',
    width: 1024,
    height: 683,
    category: 'Liverpool',
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2024/09/Hannah-and-James-38-682x1024.jpg',
    alt: 'Candid wedding photo',
    width: 682,
    height: 1024,
    category: 'Manchester',
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2023/06/EmsMatt-34-683x1024.jpg',
    alt: 'Sheffield wedding',
    width: 683,
    height: 1024,
    category: 'Sheffield',
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2025/09/Daniel-and-Rob-431-682x1024.jpg',
    alt: 'Liverpool wedding',
    width: 682,
    height: 1024,
    category: 'Liverpool',
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2023/07/Lise-and-Jay-48-663x1024.jpg',
    alt: 'Manchester wedding',
    width: 663,
    height: 1024,
    category: 'Manchester',
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2024/08/The-Kitchens-36-1024x682.jpg',
    alt: 'Capesthorne Hall wedding',
    width: 1024,
    height: 682,
    category: 'Cheshire',
  },
];

const categories = ['All', 'Manchester', 'Liverpool', 'Sheffield', 'Wales', 'Cambridge', 'Cheshire'];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredImages =
    selectedCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <main className="min-h-screen pt-20">
      <Header />

      <section className="bg-jade-cream py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h1 className="mb-8 text-6xl font-playfair font-bold text-jade-olive">
              Wedding Photography Gallery
            </h1>
            <p className="text-lg text-gray-700">
              A collection of authentic moments from weddings across the UK and beyond
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-wrap justify-center gap-4"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 transition-colors ${
                  selectedCategory === category
                    ? 'bg-jade-olive text-white'
                    : 'bg-white text-gray-700 hover:bg-jade-olive hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            layout
            className="grid gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                key={image.src}
                className="relative overflow-hidden rounded-lg shadow-lg"
                style={{
                  aspectRatio: `${image.width}/${image.height}`,
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform hover:scale-110 duration-500"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors hover:bg-black/20" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity hover:opacity-100">
                  <p className="text-white">{image.alt}</p>
                  <span className="text-sm text-jade-pink">{image.category}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
