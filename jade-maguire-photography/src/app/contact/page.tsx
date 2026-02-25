'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { motion } from 'framer-motion';

export default function ContactPage() {
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
            <h1 className="mb-6 font-carter text-6xl text-jade-pink">
              Get in Touch
            </h1>
            <p className="mb-12 text-lg text-gray-700">
              I'd love to hear about your wedding day! Fill out the form below and I'll get back to you as soon as possible.
            </p>
          </motion.div>

          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-2">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="mb-4 text-2xl font-playfair font-bold text-jade-olive">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-1 text-sm font-semibold uppercase">
                        Phone
                      </h3>
                      <p className="text-lg">07889 209246</p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-semibold uppercase">
                        Email
                      </h3>
                      <p className="text-lg">jademaguirephotography@gmail.com</p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-semibold uppercase">
                        Based In
                      </h3>
                      <p className="text-lg">Near Chester, UK</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-2xl font-playfair font-bold text-jade-olive">
                    Social Media
                  </h2>
                  <div className="space-y-4">
                    <a
                      href="https://www.instagram.com/jademaguirephotography"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-lg hover:text-jade-olive"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 1.227-.839 2.278-1.691 4.919-1.146 1.292-3.667 1.491-4.919 1.645-.126.007-.25.011-.371.011s-.245-.004-.371-.011c-1.252-.154-3.667-.353-4.919-1.645-.852-.642-1.423-1.693-1.691-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-1.227.839-2.278 1.691-4.919 1.146-1.292 3.667-1.491 4.919-1.645.127-.007.25-.011.371-.011s.245.004.371.011c1.252.154 3.667.353 4.919 1.645.852.642 1.423 1.693 1.691 4.919.058 1.265.07 1.645.07 4.849 0 3.204-.012 3.584-.069 4.849-.149 1.227-.839 2.278-1.691 4.919-1.146 1.292-3.667 1.491-4.919 1.645zm-2.881-7.38c0-3.266-2.653-5.918-5.919-5.918-3.265 0-5.919 2.652-5.919 5.918 0 3.267 2.654 5.919 5.919 5.918 3.266 0 5.919-2.651 5.919-5.918z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      @jademaguirephotography
                    </a>
                    <a
                      href="https://www.facebook.com/jademaguirephotography"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-lg hover:text-jade-olive"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Jade Maguire Photography
                    </a>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-lg">
                  <h2 className="mb-4 text-2xl font-playfair font-bold text-jade-olive">
                    Response Time
                  </h2>
                  <p className="text-gray-700">
                    I typically respond to enquiries within 24-48 hours. If you haven't heard back within this time, please follow up with a phone call or email.
                  </p>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="rounded-lg bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-playfair font-bold text-center text-jade-olive">
                    Enquire About Your Wedding
                  </h2>
                  <ContactForm />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
