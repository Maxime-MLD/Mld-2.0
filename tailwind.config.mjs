/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // Charte graphique MLD
        accent: '#3B5BFF', // couleur d'accent
        ink: '#060918',    // texte principal
        canvas: '#EBEEFF', // fond
      },
      fontFamily: {
        // Titres : Manrope — Textes : Inter
        heading: ['Manrope', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Espacements en multiples de 8px (style aéré Apple/Coinbase)
      spacing: {
        18: '4.5rem',  // 72px
        22: '5.5rem',  // 88px
        30: '7.5rem',  // 120px
        38: '9.5rem',  // 152px
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};
