'use client';

import { motion } from 'framer-motion';

export default function ContactForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  return (
    <section className="bg-jade-cream py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="mb-12 text-center text-7vw font-playfair font-bold leading-[1.1]">
            Let's work together
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-semibold uppercase">
                  Names*
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-none border border-black bg-[#F5F5F5] p-3 text-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold uppercase">
                  Email*
                </label>
                <input
                  type="email"
                  required
                  placeholder="My email is..."
                  className="w-full rounded-none border border-black bg-[#F5F5F5] p-3 text-black focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-semibold uppercase">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  required
                  placeholder="My number is..."
                  className="w-full rounded-none border border-black bg-[#F5F5F5] p-3 text-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold uppercase">
                  Wedding Date*
                </label>
                <input
                  type="date"
                  required
                  className="w-full rounded-none border border-black bg-[#F5F5F5] p-3 text-black focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold uppercase">
                Venue*
              </label>
              <input
                type="text"
                required
                placeholder="We're getting married at..."
                className="w-full rounded-none border border-black bg-[#F5F5F5] p-3 text-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold uppercase">
                How did you hear about me?*
              </label>
              <select
                required
                className="w-full rounded-none border border-black bg-[#F5F5F5] p-3 text-black focus:outline-none"
              >
                <option value="">—Please choose an option—</option>
                <option value="Google">Google</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Word of Mouth">Word of Mouth</option>
                <option value="Referral">Referral</option>
                <option value="Online Directory">Online Directory</option>
                <option value="Blog Post">Blog Post</option>
                <option value="Trade Show">Trade Show</option>
              </select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-semibold uppercase">
                  Budget*
                </label>
                <input
                  type="text"
                  required
                  placeholder="Our budget is..."
                  className="w-full rounded-none border border-black bg-[#F5F5F5] p-3 text-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold uppercase">
                  Instagram Handle*
                </label>
                <input
                  type="text"
                  required
                  placeholder="Our Instagram handles are..."
                  className="w-full rounded-none border border-black bg-[#F5F5F5] p-3 text-black focus:outline-none"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full rounded-full bg-jade-beige py-4 text-base font-semibold uppercase tracking-wider text-black hover:bg-jade-olive hover:text-white transition-colors md:w-auto md:px-12"
            >
              Submit Form!
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
