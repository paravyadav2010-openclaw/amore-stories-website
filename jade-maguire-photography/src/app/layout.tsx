import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Carter_One, Mr_Dafoe, Open_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

const carter = Carter_One({
  subsets: ["latin"],
  variable: "--font-carter",
  weight: "400",
});

const dafoe = Mr_Dafoe({
  subsets: ["latin"],
  variable: "--font-dafoe",
  weight: "400",
});

const opensans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-opensans",
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jade Maguire Photography - Modern Wedding Photographer",
  description: "Relaxed storytelling photography for couples who value authenticity - Liverpool and Manchester Wedding Photographer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body
        className={`${playfair.variable} ${montserrat.variable} ${carter.variable} ${dafoe.variable} ${opensans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
