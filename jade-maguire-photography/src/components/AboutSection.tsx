'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="bg-jade-cream py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] md:h-[600px]"
          >
            <Image
              src="https://www.jademaguirephotography.uk/wp-content/uploads/2026/01/IMG_8457.jpeg"
              alt="Jade Maguire - Wedding Photographer"
              fill
              className="object-cover object-top"
            />
          </motion.div>

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center space-y-6 px-4 md:px-12"
          >
            <div className="space-y-2">
              <h1 className="text-[9vh] leading-[1.1] font-playfair font-bold">
                <span className="relative inline-block">
                  Hey There – I'm Jade!
                  <span className="absolute bottom-[0.07em] left-0 right-0 h-[0.3em] bg-jade-olive/30" />
                </span>
              </h1>
              <h2 className="text-[3vh] leading-[1.1] font-playfair font-semibold text-jade-olive">
                Your Modern Wedding Photographer
              </h2>
            </div>

            <div className="space-y-4 font-montserrat text-base leading-relaxed">
              <p>
                I'm a modern documentary wedding photographer based near Chester, capturing weddings across Manchester, Liverpool, London, the UK and Europe. With over 11 years and 250+ weddings behind me, I've photographed love stories everywhere, from city rooftops and destination weddings to festival fields, elopements and unapologetically big celebrations.
              </p>
              <p className="font-semibold">
                I don't stage moments. I don't interrupt them either.
                <br />
                No cheese. No awkward posing. Just real life, unfolding.
              </p>
              <p>
                I blend into the background, read the room, and catch what's about to happen before it does, so your gallery is full of honest, fleeting moments you'll feel every time you look back. The nerves. The laughter. The chaos. The calm.
              </p>
              <p className="italic">
                This isn't about perfect photos.
                <br />
                It's about remembering how it all felt.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 border-b-2 border-black pb-1 text-sm uppercase tracking-wider hover:border-jade-olive transition-colors"
            >
              Tell me your story!
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
