import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Praveen Kumar | Senior Rotoscope Artist & Full-Stack Developer",
  description: "Senior Rotoscope Artist at Weta FX with 7 years of experience. Full-stack developer specializing in Python, React, Next.js, and automation. Moving to Melbourne, Australia in March 2026.",
  keywords: [
    "Praveen Kumar",
    "Senior Rotoscope Artist",
    "VFX Artist",
    "Weta FX",
    "Visual Effects",
    "Full-Stack Developer",
    "Python Developer",
    "React Developer",
    "Next.js",
    "Web Development",
    "Automation",
    "New Zealand VFX",
    "Melbourne VFX",
    "Rotoscope",
    "Nuke",
    "Compositing"
  ],
  authors: [{ name: "Praveen Kumar" }],
  creator: "Praveen Kumar",
  publisher: "Praveen Kumar",
  openGraph: {
    type: "website",
    locale: "en_NZ",
    url: "https://praveenkumar.nz",
    title: "Praveen Kumar | Senior Rotoscope Artist & Full-Stack Developer",
    description: "Senior Rotoscope Artist at Weta FX with 7 years of experience. Full-stack developer specializing in automation and modern web technologies.",
    siteName: "Praveen Kumar Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Praveen Kumar - Senior Rotoscope Artist & Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Praveen Kumar | Senior Rotoscope Artist & Full-Stack Developer",
    description: "Senior Rotoscope Artist at Weta FX with 7 years of experience. Moving to Melbourne, Australia.",
    creator: "@TraderParav",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background-main text-text-body`}
      >
        {children}
      </body>
    </html>
  );
}
