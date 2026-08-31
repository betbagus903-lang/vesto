import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    server: {
        port: 5173,
        strictPort: false,
        watch: {
            ignored: ['**/vendor/**', '**/node_modules/**', '**/storage/**', '**/public/**']
        }
    },
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});