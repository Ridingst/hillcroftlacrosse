const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: ['_site/**/*.html'],
    options: {
      safelist: [],
    },
  },
  theme: {
    extend: {
      colors: {
        change: 'black',
        amber: colors.amber,
        yellow: {
          DEFAULT: "#fbbf24"
        },
        gray: {
          DEFAULT: "#111827",
          light: "#6b7280",
        }
      },
    },
    fontFamily: {
      'sans': "montserrat, helvetica, arial, sans-serif",
    }
  },
  variants: {},
  plugins: [],
}
