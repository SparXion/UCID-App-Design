/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        black: '#000000',
        white: '#ffffff',
        // Secondary grays
        'dark-gray': '#333333',
        'medium-gray': '#666666',
        'light-gray': '#999999',
        'border-gray': '#e0e0e0',
        'bg-gray': '#f5f5f5',
        'very-light-gray': '#fafafa',
        // Dark mode
        'dark-bg': '#000000',
        'dark-text': '#ffffff',
        'dark-secondary-bg': '#1a1a1a',
        'dark-hover-bg': '#2a2a2a',
        'dark-secondary-text': '#cccccc',
        // Accent colors (minimal use)
        error: '#dc3545',
        warning: '#ff9800',
      },
      fontFamily: {
        sans: ["'SF Pro Display'", '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'Roboto', 'sans-serif'],
        mono: ["'Monaco'", "'Menlo'", "'Courier New'", 'monospace'],
      },
      fontSize: {
        'h1': ['3rem', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '300' }],
        'h2': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }],
        'h3': ['1.2rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }],
        'body': ['0.95rem', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['0.85rem', { lineHeight: '1.4', fontWeight: '400' }],
        'tiny': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        'tiny': '8px',
        'small': '12px',
        'medium': '20px',
        'large': '30px',
        'xlarge': '50px',
      },
      borderRadius: {
        'subtle': '4px',
        'card': '6px',
        'modal': '8px',
      },
      borderWidth: {
        'bold': '2px',
      },
      transitionDuration: {
        'standard': '200ms',
        'smooth': '300ms',
        'fast': '100ms',
      },
      boxShadow: {
        'subtle': '0 2px 4px rgba(0,0,0,0.1)',
        'medium': '0 2px 8px rgba(0,0,0,0.15)',
        'strong': '0 3px 12px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}

