'use client';

import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import AboutSection from '@/components/AboutSection';
import GalleryCarousel from '@/components/GalleryCarousel';
import Testimonials from '@/components/Testimonials';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <HeroSlider />

      {/* About Section */}
      <AboutSection />

      {/* Second Hero with Wave */}
      <section className="relative h-[600px] overflow-hidden bg-jade-cream">
        {/* Wave Divider */}
        <div className="absolute top-0 left-0 right-0 z-20 h-[18%] rotate-180">
          <svg
            className="h-full w-full"
            viewBox="0 0 1000 300"
            preserveAspectRatio="none"
            fill="#efe9e9"
          >
            <path d="M 850.23 235.79 a 1.83 1.83 0 0 0 -0.8 -3.24 c -10.23 -2 -53.38 -23.41 -97.44 -43.55 c -244.99 -112 -337.79 97.38 -432.99 104 c -115 8 -217 -87 -330 -37 c 0 0 9 15 9 42 v -1 h 849 l 2 -55 s -2.87 -3 1.23 -6.21 z"></path>
            <path d="M 1000 300 l 1 -230.29 c -217 -12.71 -300.47 129.15 -404 156.29 c -103 27 -174 -30 -257 -29 c -80 1 -130.09 37.07 -214 70 c -61.23 24 -108 15.61 -126 10.61 v 22.39 z"></path>
          </svg>
        </div>

        <div className="relative h-full">
          {/* Parallax Background */}
          <motion.div
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img
              src="https://www.jademaguirephotography.uk/wp-content/uploads/2025/09/Highlights-Amy-Liam-Scale-Liverpool_-18-scaled.jpg"
              alt="Wedding photography"
              className="h-full w-full object-cover object-bottom"
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-jade-cream py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-5xl space-y-8 text-center"
          >
            <h1 className="text-[52px] font-playfair font-semibold leading-[1.1] text-jade-olive">
              For Those Modern Romantics To The Wild Party Starters, Who Want Authentic Storytelling!
            </h1>

            <div className="space-y-4 text-lg">
              <p className="font-semibold">
                A Modern wedding photographer for couples who want documentary storytelling as your day naturally unfolds with no cringe.
              </p>
              <p>
                Although mostly conducting wedding photography in Manchester and Liverpool Region – There is no where i won't travel to for love and a good party, and my 250+ weddings have taken me all over the world over the last 11 years!
              </p>
              <p>
                I don't believe in a rule book… If you want honest story telling, the adventures being documented with heart and emotion rather than forced posey images that make you seriously friggin cringe, and images that invoke emotion that tell your story perfectly, then we are an awesome match.
              </p>
              <p>
                You deserve to have a photographer that really gets you, and guess what, i hear you saying you don't like being in front of the camera or feel awkward, here's a secret… i do too and 95% of my couples are the same!
              </p>
              <p className="font-semibold">Tell me about your day!</p>
            </div>

            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full bg-jade-cyan px-8 py-4 text-lg font-semibold uppercase tracking-wider hover:bg-jade-olive hover:text-white transition-colors"
            >
              Get in touch
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <GalleryCarousel />

      {/* Photography Style Section */}
      <section className="bg-jade-cream py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px]"
            >
              <img
                src="https://www.jademaguirephotography.uk/wp-content/uploads/2022/03/E_C-ConstellationsWedding2019-971.jpg"
                alt="Wedding photography style"
                className="h-full w-full object-cover"
              />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center space-y-6 px-4 md:px-12"
            >
              <h2 className="text-[3vw] font-playfair font-semibold text-jade-olive">
                Modern wedding photography – real, relaxed and entirely you!
              </h2>

              <div className="space-y-4 font-montserrat">
                <p>
                  My approach is simple: I blend in, read the room, and document the moments that matter.
                </p>
                <p>
                  You won't be asked to fake laugh or stand stiffly for portraits. Instead, you'll get <strong>photographs that feel effortless,</strong> full of movement, energy, and connection that really represents you. I'll be right in the thick of it all day, without ever making you feel watched or put on display, infact you won't even know i'm there.
                </p>
                <p>
                  Whether you're having an intimate registry office ceremony or a full scale city celebration with a live band and 2am kebabs — I'm all in.
                </p>
                <p className="font-semibold">I'm known for shooting weddings in:</p>
                <ul className="list-inside list-disc space-y-2">
                  <li>Industrial spaces with good lighting and even better energy</li>
                  <li>Design-led venues that ditch the clichés</li>
                  <li>Intimate city celebrations with style and soul</li>
                  <li>DIY days where the party is just as important as the ceremony</li>
                  <li>Relaxed, modern weddings that put people and connection first</li>
                </ul>
                <p className="italic">
                  For me, no two weddings I shoot are the same, and that's exactly how it should be.
                </p>
                <p>
                  So it's time to tell me about your day! Don't hold back on any details – I want to know all about your vision and your magical wedding ideas.
                </p>
                <p>
                  Let's chat and see what magic we can create together! Just fill in the form, and I'll get back to you as soon as I possibly can!
                </p>
              </div>

              <motion.a
                href="/pricing"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-full bg-jade-cyan px-6 py-3 text-base font-semibold uppercase tracking-wider hover:bg-jade-olive hover:text-white transition-colors"
              >
                Packages
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Four Column Image Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4">
        {[
          'https://www.jademaguirephotography.uk/wp-content/uploads/2023/07/Lise-and-Jay-35.jpg',
          'https://www.jademaguirephotography.uk/wp-content/uploads/2023/07/Sarah-and-Chris-32.jpg',
          'https://www.jademaguirephotography.uk/wp-content/uploads/2025/05/DA-303-scaled.jpg',
          'https://www.jademaguirephotography.uk/wp-content/uploads/2025/08/DR-508-scaled.jpg',
        ].map((src, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative aspect-square overflow-hidden"
          >
            <img
              src={src}
              alt={`Wedding photo ${index + 1}`}
              className="h-full w-full object-cover transition-transform hover:scale-110 duration-500"
            />
            <div className="absolute inset-0 bg-black/5" />
          </motion.div>
        ))}
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Contact Form */}
      <ContactForm />

      {/* Footer */}
      <Footer />
    </main>
  );
}
