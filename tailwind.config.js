/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Configuración de familias de fuentes personalizadas
      fontFamily: {
        'role-display': ['Poppins', 'sans-serif'], // Fuente principal para roles
        'role-elegant': ['Playfair Display', 'serif'], // Fuente elegante para roles
        'role-modern': ['Inter', 'sans-serif'], // Fuente moderna para roles
        'role-classic': ['Roboto Slab', 'serif'], // Fuente clásica para roles
      },
    },
  },
  plugins: [],
};
