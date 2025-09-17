import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default ({ mode }) => ({
  plugins: [react()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  publicDir: 'media',
  base: '/',
});
