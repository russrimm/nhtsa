import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('maplibre-gl'))
                        return 'vendor-map';
                    if (id.includes('recharts') || id.includes('victory-vendor') || id.includes('d3-'))
                        return 'vendor-charts';
                    if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/'))
                        return 'vendor-react';
                    if (id.includes('react-router') || id.includes('@remix-run'))
                        return 'vendor-router';
                    if (id.includes('@tanstack'))
                        return 'vendor-query';
                    if (id.includes('@radix-ui'))
                        return 'vendor-radix';
                    if (id.includes('node_modules'))
                        return 'vendor-misc';
                },
            },
        },
    },
    server: {
        port: 5173,
        // Dev-only fallback proxy in case any NHTSA endpoint blocks browser CORS.
        // Usage: prefix the call with /nhtsa-api/... in api clients if you flip USE_PROXY=true.
        proxy: {
            '/nhtsa-api': {
                target: 'https://api.nhtsa.gov',
                changeOrigin: true,
                secure: true,
                rewrite: (p) => p.replace(/^\/nhtsa-api/, ''),
            },
            '/vpic-api': {
                target: 'https://vpic.nhtsa.dot.gov/api',
                changeOrigin: true,
                secure: true,
                rewrite: (p) => p.replace(/^\/vpic-api/, ''),
            },
        },
    },
});
