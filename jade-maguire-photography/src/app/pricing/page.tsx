'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const packages = [
  {
    name: 'Essential Collection',
    price: 'From £2,200',
    hours: '8 hours coverage',
    includes: [
      'Pre-wedding consultation',
      'Beautifully edited high-resolution digital gallery',
      'Online gallery for sharing',
      'USB drive',
    ],
    highlights: 'Perfect for intimate ceremonies and celebrations',
  },
  {
    name: 'Classic Collection',
    price: 'From £2,800',
    hours: '10 hours coverage',
    includes: [
      'Pre-wedding consultation',
      'Engagement shoot',
      'Beautifully edited high-resolution digital gallery',
      'Online gallery for sharing',
      'USB drive',
      'Second photographer available',
    ],
    highlights: 'Our most popular package',
    featured: true,
  },
  {
    name: 'Premium Collection',
    price: 'From £3,500',
    hours: 'Full day coverage',
    includes: [
      'Pre-wedding consultation',
      'Engagement shoot',
      'Beautifully edited high-resolution digital gallery',
      'Online gallery for sharing',
      'USB drive',
      'Second photographer included',
      'Fine art album',
      'Parent albums',
    ],
    highlights: 'Everything you need for the complete story',
  },
];

const addOns = [
  { name: 'Extra Hours', price: '£200 per hour' },
  { name: 'Second Photographer', price: 'From £500' },
  { name: 'Fine Art Album', price: 'From £400' },
  { name: 'Engagement Shoot', price: 'From £350' },
  { name: 'Same Day Edit', price: 'From £600' },
];

export default function PricingPage() {
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
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 font-carter text-6xl text-jade-cyan">
              Wedding Photography Investment
            </h1>
            <p className="text-lg text-gray-700">
              Beautiful, authentic photography that tells your unique love story
            </p>
          </motion.div>

          {/* Packages */}
          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid gap-8 md:grid-cols-3">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative overflow-hidden rounded-lg bg-white p-8 shadow-lg ${
                    pkg.featured ? 'ring-4 ring-jade-olive scale-105' : ''
                  }`}
                >
                  {pkg.featured && (
                    <div className="absolute right-0 top-0 rounded-bl-lg bg-jade-olive px-4 py-2 text-sm font-semibold text-white">
                      Most Popular
                    </div>
                  )}

                  <h3 className="mb-2 text-2xl font-playfair font-bold text-jade-olive">
                    {pkg.name}
                  </h3>
                  <p className="mb-4 text-lg font-semibold text-jade-cyan">
                    {pkg.price}
                  </p>
                  <p className="mb-6 text-sm text-gray-600">{pkg.hours}</p>

                  <ul className="mb-8 space-y-3">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg
                          className="mt-1 h-5 w-5 flex-shrink-0 text-jade-olive"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mb-6 italic text-gray-600">{pkg.highlights}</p>

                  <button className="w-full rounded-full bg-jade-beige py-3 font-semibold uppercase tracking-wider text-black transition-colors hover:bg-jade-olive hover:text-white">
                    Enquire Now
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto mt-16 max-w-5xl"
          >
            <h2 className="mb-8 text-4xl font-playfair font-bold text-center text-jade-olive">
              Available Add-ons
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {addOns.map((addOn, index) => (
                <motion.div
                  key={addOn.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between rounded-lg bg-white p-6 shadow-md"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{addOn.name}</h3>
                  </div>
                  <span className="text-lg font-bold text-jade-cyan">
                    {addOn.price}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto mt-16 max-w-4xl rounded-lg bg-white p-8 shadow-lg"
          >
            <h2 className="mb-6 text-2xl font-playfair font-bold text-jade-olive">
              Investment Includes
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 text-jade-olive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Beautifully edited high-resolution digital gallery delivered within 8-12 weeks</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 text-jade-olive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Online gallery for easy sharing with family and friends</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 text-jade-olive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Pre-wedding consultation to discuss your vision</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 text-jade-olive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Documentary-style photography capturing authentic moments</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 text-jade-olive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Full rights to print and share your images</span>
              </li>
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto mt-12 text-center"
          >
            <p className="mb-6 text-lg">
              Every wedding is unique, and I'd love to hear about yours. Let's chat about creating a custom package that's perfect for you.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-jade-cyan px-8 py-4 text-lg font-semibold uppercase tracking-wider transition-colors hover:bg-jade-olive hover:text-white"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
