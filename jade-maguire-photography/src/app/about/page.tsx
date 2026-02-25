'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function AboutPage() {
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
            className="mx-auto max-w-4xl"
          >
            <h1 className="mb-8 text-6xl font-playfair font-bold text-jade-olive">
              About Jade
            </h1>

            <div className="space-y-6 text-lg">
              <p>
                I'm a modern documentary wedding photographer based near Chester, capturing weddings across Manchester, Liverpool, London, the UK and Europe. With over 11 years and 250+ weddings behind me, I've photographed love stories everywhere, from city rooftops and destination weddings to festival fields, elopements and unapologetically big celebrations.
              </p>

              <p>
                I don't stage moments. I don't interrupt them either. No cheese. No awkward posing. Just real life, unfolding.
              </p>

              <p>
                I blend into the background, read the room, and catch what's about to happen before it does, so your gallery is full of honest, fleeting moments you'll feel every time you look back. The nerves. The laughter. The chaos. The calm.
              </p>

              <p className="text-2xl font-playfair font-semibold italic text-jade-olive">
                This isn't about perfect photos. It's about remembering how it all felt.
              </p>

              <p>
                My approach is simple: I blend in, read the room, and document the moments that matter. You won't be asked to fake laugh or stand stiffly for portraits. Instead, you'll get photographs that feel effortless, full of movement, energy, and connection that really represents you.
              </p>

              <h2 className="text-4xl font-playfair font-bold text-jade-olive mt-12 mb-6">
                What I Love to Shoot
              </h2>

              <ul className="list-inside list-disc space-y-3">
                <li>Industrial spaces with good lighting and even better energy</li>
                <li>Design-led venues that ditch the clichés</li>
                <li>Intimate city celebrations with style and soul</li>
                <li>DIY days where the party is just as important as the ceremony</li>
                <li>Relaxed, modern weddings that put people and connection first</li>
              </ul>

              <div className="mt-12 rounded-lg bg-white p-8 shadow-lg">
                <h3 className="text-2xl font-playfair font-semibold text-jade-olive mb-4">
                  A Few Fun Facts
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-jade-olive" />
                    <span>Over 250 weddings photographed</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-jade-olive" />
                    <span>11+ years of experience</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-jade-olive" />
                    <span>Based near Chester, UK</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-jade-olive" />
                    <span>Available worldwide for destination weddings</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
