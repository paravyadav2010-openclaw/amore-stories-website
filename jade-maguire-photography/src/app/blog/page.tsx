'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const blogPosts = [
  {
    title: 'How to Choose the Perfect Wedding Photographer',
    excerpt: 'Tips and advice on finding a photographer who matches your style and captures your day authentically.',
    date: 'February 2025',
    image: 'https://www.jademaguirephotography.uk/wp-content/uploads/2025/02/Hannah-and-James-704-682x1024.jpg',
    slug: 'choose-wedding-photographer',
  },
  {
    title: 'My Favourite Wedding Venues in Manchester',
    excerpt: 'A guide to the most beautiful and unique wedding venues in and around Manchester.',
    date: 'January 2025',
    image: 'https://www.jademaguirephotography.uk/wp-content/uploads/2024/09/Hannah-and-James-28-scaled.jpg',
    slug: 'manchester-wedding-venues',
  },
  {
    title: 'Documentary vs Traditional Wedding Photography',
    excerpt: 'Understanding the difference between candid documentary style and traditional posed photography.',
    date: 'December 2024',
    image: 'https://www.jademaguirephotography.uk/wp-content/uploads/2023/07/Hollie-and-Dave-366.jpg',
    slug: 'documentary-traditional-photography',
  },
  {
    title: 'Planning a Timeline for Your Wedding Day',
    excerpt: 'How to create a realistic timeline that ensures you get all the photos you want.',
    date: 'November 2024',
    image: 'https://www.jademaguirephotography.uk/wp-content/uploads/2023/07/Sarah-and-Chris-27.jpg',
    slug: 'wedding-day-timeline',
  },
  {
    title: 'Tips for Feeling Comfortable in Front of the Camera',
    excerpt: "Don't like being photographed? You're not alone. Here's how to feel more at ease.",
    date: 'October 2024',
    image: 'https://www.jademaguirephotography.uk/wp-content/uploads/2025/07/Daniel-and-Rob-416-scaled.jpg',
    slug: 'comfortable-camera',
  },
  {
    title: 'Real Weddings: Hannah & James at Victoria Baths',
    excerpt: 'A beautiful authentic wedding at one of Manchester\'s most iconic venues.',
    date: 'September 2024',
    image: 'https://www.jademaguirephotography.uk/wp-content/uploads/2024/09/Hannah-and-James-5-1024x683.jpg',
    slug: 'real-wedding-hannah-james',
  },
];

export default function BlogPage() {
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
            className="mx-auto max-w-6xl"
          >
            <h1 className="mb-6 text-6xl font-playfair font-bold text-jade-olive">
              Wedding Photography Blog
            </h1>
            <p className="mb-12 text-lg text-gray-700">
              Tips, inspiration, and real wedding stories to help you plan your perfect day
            </p>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-105"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <span className="mb-2 inline-block text-sm font-semibold text-jade-pink">
                        {post.date}
                      </span>
                      <h2 className="mb-3 text-xl font-playfair font-semibold text-jade-olive hover:text-jade-cyan transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-jade-olive hover:text-jade-cyan transition-colors">
                        Read More
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-16 rounded-lg bg-white p-8 shadow-lg"
            >
              <h2 className="mb-4 text-2xl font-playfair font-bold text-center text-jade-olive">
                Subscribe to Wedding Tips
              </h2>
              <p className="mb-6 text-center text-gray-700">
                Get the latest wedding photography tips and real wedding stories delivered to your inbox.
              </p>
              <form className="mx-auto max-w-md space-y-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-none border border-black bg-[#F5F5F5] p-3 text-black focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-jade-beige py-3 text-base font-semibold uppercase tracking-wider text-black transition-colors hover:bg-jade-olive hover:text-white"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
