'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'How long have you been a wedding photographer?',
    answer: 'I have been a wedding photographer for over 11 years, documenting more than 250 weddings across the UK, Europe, and worldwide. My experience covers everything from intimate registry office ceremonies to large-scale celebrations.',
  },
  {
    question: 'What is your photography style?',
    answer: 'I specialize in documentary-style wedding photography. I blend into the background, read the room, and capture honest, fleeting moments as they naturally unfold. No awkward posing, no fake moments - just real life.',
  },
  {
    question: 'How many photos will we receive?',
    answer: 'The number of photos varies based on your package and the length of coverage. Typically, couples receive between 400-800 fully edited, high-resolution images from a full day of coverage.',
  },
  {
    question: 'When will we receive our photos?',
    answer: 'Your beautifully edited gallery is typically delivered within 8-12 weeks after your wedding day. I take great care with every image to ensure they meet my high standards.',
  },
  {
    question: 'Do you travel for weddings?',
    answer: 'Absolutely! While I\'m based near Chester and regularly photograph weddings in Manchester, Liverpool, and across the UK, I love destination weddings. There\'s nowhere I won\'t travel for love and a good party.',
  },
  {
    question: 'Can we meet before booking?',
    answer: 'Yes, I encourage it! Whether in person or via video call, I\'d love to chat about your wedding vision and ensure we\'re the perfect match for each other.',
  },
  {
    question: 'What happens if you\'re ill on our wedding day?',
    answer: 'I have a network of trusted professional photographers I can call upon if, in the extremely unlikely event, I cannot photograph your wedding. Rest assured, you\'ll still have excellent coverage.',
  },
  {
    question: 'Do we get the raw files?',
    answer: 'My packages include fully edited, high-resolution images. I don\'t provide raw files as I believe in delivering the best possible version of each image. However, all edited images come with full printing and sharing rights.',
  },
  {
    question: 'How do we book you?',
    answer: 'Simply fill out the enquiry form on the contact page with your wedding details. I\'ll get back to you within 24-48 hours to arrange a chat and send over my contract and booking information.',
  },
  {
    question: 'What payment options do you offer?',
    answer: 'I typically require a 30% deposit to secure your wedding date, with the remaining balance due 4 weeks before your wedding day. Payment can be made via bank transfer.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
            <h1 className="mb-6 text-6xl font-playfair font-bold text-jade-olive">
              Frequently Asked Questions
            </h1>
            <p className="mb-12 text-lg text-gray-700">
              Everything you need to know about booking Jade Maguire Photography for your wedding
            </p>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="overflow-hidden rounded-lg bg-white shadow-md"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-jade-cream"
                  >
                    <span className="text-lg font-semibold">{faq.question}</span>
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 flex-shrink-0 text-jade-olive" />
                    ) : (
                      <ChevronDown className="h-5 w-5 flex-shrink-0 text-jade-olive" />
                    )}
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: openIndex === index ? 'auto' : 0,
                      opacity: openIndex === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-700">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-12 text-center"
            >
              <p className="mb-6 text-lg">
                Still have questions? I'd love to hear from you!
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-jade-cyan px-8 py-4 text-lg font-semibold uppercase tracking-wider transition-colors hover:bg-jade-olive hover:text-white"
              >
                Get in Touch
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
