// apps/web/postcss.config.mjs
// PostCSS config for the web app.
// Linked files: app/globals.css.
// This enables Tailwind CSS processing for Next.js.

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;