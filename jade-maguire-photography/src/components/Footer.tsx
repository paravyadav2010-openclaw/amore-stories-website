import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-lg font-semibold font-playfair">Get in Touch</h4>
            <div className="space-y-2">
              <p>T: 07889 209246</p>
              <p>E: jademaguirephotography@gmail.com</p>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold font-playfair">Useful Links</h4>
            <div className="space-y-2">
              <Link href="/liverpool-wedding-photographer" className="block hover:text-jade-pink">
                Liverpool Wedding Photographer
              </Link>
              <Link href="/alternative-wedding-photographer" className="block hover:text-jade-pink">
                Alternative Wedding Photographer
              </Link>
              <Link href="/middleton-lodge" className="block hover:text-jade-pink">
                Middleton Lodge
              </Link>
              <Link href="/trafalgar-warehouse" className="block hover:text-jade-pink">
                Trafalgar Warehouse
              </Link>
              <Link href="/privacy-policy" className="block hover:text-jade-pink">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Site Navigation */}
          <div>
            <h4 className="mb-4 text-lg font-semibold font-playfair">Site Navigation</h4>
            <div className="space-y-2">
              <Link href="/" className="block hover:text-jade-pink">
                Home
              </Link>
              <Link href="/about" className="block hover:text-jade-pink">
                About
              </Link>
              <Link href="/gallery" className="block hover:text-jade-pink">
                Gallery
              </Link>
              <Link href="/faq" className="block hover:text-jade-pink">
                FAQ
              </Link>
              <Link href="/pricing" className="block hover:text-jade-pink">
                Pricing
              </Link>
              <Link href="/blog" className="block hover:text-jade-pink">
                Blog
              </Link>
              <Link href="/contact" className="block hover:text-jade-pink">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm">
          <p>
            © 2026 Jade Maguire Photography.{' '}
            <a
              href="https://www.designersupnorth.com/website-design-manchester/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-jade-pink"
            >
              Web Design Manchester
            </a>{' '}
            by DUN
          </p>
        </div>
      </div>
    </footer>
  );
}
