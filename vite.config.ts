import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    // Build to docs so GitHub Pages can serve from /docs
    build: {
      outDir: 'docs',
      emptyOutDir: true,
    },
    // Treat media as public assets (logo.png provided by user)
    publicDir: 'media',
    // For GitHub Pages under a project site, base should be '/<repo>/'
    // We'll keep default '/' and document how to change if repo is not username.github.io
    base: '/',
  };
});
