module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // If using the /app directory
    './pages/**/*.{js,ts,jsx,tsx}', // If using the /pages directory
    './components/**/*.{js,ts,jsx,tsx}', // For your components
  ],
  theme: {
    extend: {}, // Extend the default Tailwind theme here
  },
  plugins: [], // Add plugins if needed
};
