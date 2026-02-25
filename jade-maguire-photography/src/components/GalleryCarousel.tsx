'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const galleryImages: GalleryImage[] = [
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2025/02/Hannah-and-James-704-682x1024.jpg',
    alt: 'Hannah and James wedding',
    width: 682,
    height: 1024,
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2023/06/EmsMatt-15-1024x683.jpg',
    alt: 'Confetti moment',
    width: 1024,
    height: 683,
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2024/09/Hannah-and-James-5-1024x683.jpg',
    alt: 'Victoria Baths wedding',
    width: 1024,
    height: 683,
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2024/08/Amanda-and-Mike-82-683x1024.jpg',
    alt: 'Festival wedding',
    width: 683,
    height: 1024,
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2025/05/DA-345-682x1024.jpg',
    alt: 'Love Lane Brewery wedding',
    width: 682,
    height: 1024,
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2023/07/Noosh-and-Christian-17-1024x712.jpg',
    alt: 'Alternative wedding',
    width: 1024,
    height: 712,
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2023/07/Sarah-and-Chris-6-1024x683.jpg',
    alt: 'Sefton church wedding',
    width: 1024,
    height: 683,
  },
  {
    src: 'https://www.jademaguirephotography.uk/wp-content/uploads/2024/09/Hannah-and-James-38-682x1024.jpg',
    alt: 'Candid wedding photo',
    width: 682,
    height: 1024,
  },
];

export default function GalleryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => ref.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <section className="bg-jade-cream py-20">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-4 rounded-full bg-white p-3 shadow-lg hover:bg-jade-olive transition-colors"
              aria-label="Scroll left"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Gallery */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0"
                style={{
                  width: image.width > image.height ? '400px' : '300px',
                  height: image.width > image.height ? '300px' : '400px',
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform hover:scale-110 duration-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 rounded-full bg-white p-3 shadow-lg hover:bg-jade-olive transition-colors"
              aria-label="Scroll right"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
