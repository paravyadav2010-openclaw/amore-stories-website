import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'jade-cream': '#efe9e9',
        'jade-olive': '#6e7250',
        'jade-beige': '#f8e7bb',
        'jade-pink': '#EDA89A',
        'jade-cyan': '#93D2CF',
        'jade-black': '#000000',
        'jade-white': '#ffffff',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
        'carter': ['"Carter One"', 'cursive'],
        'dafoe': ['"Mr Dafoe"', 'cursive'],
        'opensans': ['"Open Sans"', 'sans-serif'],
      },
      spacing: {
        '14': '3.5rem',
        '18': '4.5rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
