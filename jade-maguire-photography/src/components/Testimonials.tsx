'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Testimonial {
  name: string;
  location: string;
  text: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Daniel & Rob",
    location: "Gusto Albert Dock",
    text: "We got married at the end of February 2025 and feel incredibly lucky to have had Jade as our wedding photographer. From the very beginning, Jade made us feel completely at ease. It honestly felt like we had known her for years. She was so warm, friendly, and professional, and she fitted in perfectly with our day. She wasn't intrusive at all. In fact, her calming presence made the day even more enjoyable for us and our guests. We will treasure these photos forever and are so grateful to Jade for everything.",
    image: "https://www.jademaguirephotography.uk/wp-content/uploads/2025/09/Daniel-and-Rob-440-199x300.jpg",
  },
  {
    name: "Daniel and Andrew",
    location: "Love Land Brewery",
    text: "Jade was amazing! From the initial meetings to the delivery of our gallery, she was so attentive and listens to all the information that we threw at her. She also helped us navigate a few decisions not related to our photography with her breadth of wedding expertise. On the day she was adaptive, captured all of the key moments and really put us at ease!",
    image: "https://www.jademaguirephotography.uk/wp-content/uploads/2025/05/DA-345-200x300.jpg",
  },
  {
    name: "Becca and Chris",
    location: "Oh Me Oh My",
    text: "Jade captured our special day perfectly. From enquiring to booking to the big day, the whole process was smooth and Jade's relaxed approach made planning much easier! Jade is not only incredibly talented but has fun with her work too! We had a blast getting to know her and she really nailed the vibe we were going for.",
    image: "https://www.jademaguirephotography.uk/wp-content/uploads/2025/09/Becca-and-Chris-217-200x300.jpg",
  },
  {
    name: "Hannah",
    location: "Victoria Baths",
    text: "Jade is a superwoman! From the initial meeting we just knew she was the one to capture our day perfectly - we just clicked. Her excitement over our venue, ideas we wouldn't even have thought of. Nothing boring or generic about the whole experience! Could not recommend Jade enough to anyone.",
    image: "https://www.jademaguirephotography.uk/wp-content/uploads/2024/09/Hannah-and-James-38-200x300.jpg",
  },
];

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="relative bg-black py-20 overflow-hidden">
      {/* Scrolling Text */}
      <div className="relative overflow-hidden py-12">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[...Array(4)].map((_, i) => (
            <h1 key={i} className="text-[52px] md:text-[3vw] text-white mx-8 font-playfair">
              Client Love Letters.
            </h1>
          ))}
        </motion.div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 mt-12">
        <div className="max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: index === currentTestimonial ? 1 : 0,
                y: index === currentTestimonial ? 0 : 50,
              }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 flex flex-col items-center text-center ${index === currentTestimonial ? 'relative' : 'hidden'}`}
            >
              <div className="relative mb-6 h-32 w-32">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="rounded-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center text-6xl text-white/20">
                  "
                </div>
              </div>

              <blockquote className="mb-6 text-lg md:text-xl text-white font-light leading-relaxed">
                <span className="text-4xl text-white/40">"</span>
                {testimonial.text}
                <span className="text-4xl text-white/40">"</span>
              </blockquote>

              <div className="text-white">
                <span className="font-semibold font-playfair">{testimonial.name}</span>
                <span className="mx-2">|</span>
                <span className="text-jade-pink">{testimonial.location}</span>
              </div>

              {/* Star Rating */}
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Navigation */}
          <div className="relative flex justify-center gap-4 mt-64">
            <button
              onClick={prevTestimonial}
              className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
