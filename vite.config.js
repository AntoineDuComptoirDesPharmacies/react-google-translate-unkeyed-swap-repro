import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` lets the built page be served from GitHub Pages at
// https://antoineducomptoirdespharmacies.github.io/react-google-translate-unkeyed-swap-repro/
// `npm run dev` and `npm test` are unaffected (vite preview honours base).
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES
    ? '/react-google-translate-unkeyed-swap-repro/'
    : '/',
});
