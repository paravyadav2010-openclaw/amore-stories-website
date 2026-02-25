'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Slide {
  image: string;
  alt: string;
}

const slides: Slide[] = [
  {
    image: 'https://www.jademaguirephotography.uk/wp-content/uploads/2025/09/Highlights-Amy-Liam-Scale-Liverpool_-29-scaled.jpg',
    alt: 'Wedding photography',
  },
  {
    image: 'https://www.jademaguirephotography.uk/wp-content/uploads/2024/09/Hannah-and-James-28-scaled.jpg',
    alt: 'Couple wedding photo',
  },
  {
    image: 'https://www.jademaguirephotography.uk/wp-content/uploads/2023/07/Hollie-and-Dave-366.jpg',
    alt: 'Wedding celebration',
  },
  {
    image: 'https://www.jademaguirephotography.uk/wp-content/uploads/2023/07/Sarah-and-Chris-27.jpg',
    alt: 'Wedding ceremony',
  },
  {
    image: 'https://www.jademaguirephotography.uk/wp-content/uploads/2025/07/Daniel-and-Rob-416-scaled.jpg',
    alt: 'Wedding party',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen overflow-hidden bg-jade-cream">
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-[15%] overflow-hidden">
        <svg
          className="h-full w-full"
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
          fill="#f0ece5"
        >
          <path d="M 1000 299 l 2 -279 c -155 -36 -310 135 -415 164 c -102.64 28.35 -149 -32 -232 -31 c -80 1 -142 53 -229 80 c -65.54 20.34 -101 15 -126 11.61 v 54.39 z"></path>
          <path d="M 1000 286 l 2 -252 c -157 -43 -302 144 -405 178 c -101.11 33.38 -159 -47 -242 -46 c -80 1 -145.09 54.07 -229 87 c -65.21 25.59 -104.07 16.72 -126 10.61 v 22.39 z"></path>
          <path d="M 1000 300 l 1 -230.29 c -217 -12.71 -300.47 129.15 -404 156.29 c -103 27 -174 -30 -257 -29 c -80 1 -130.09 37.07 -214 70 c -61.23 24 -108 15.61 -126 10.61 v 22.39 z"></path>
        </svg>
      </div>

      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentSlide ? 1 : 0,
              scale: index === currentSlide ? 1 : 1.1,
            }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <motion.div style={{ y }} className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover object-center"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-20 left-1/2 z-30 flex -translate-x-1/2 space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-12 bg-white'
                : 'w-3 bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
