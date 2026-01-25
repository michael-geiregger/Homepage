import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/Homepage/', // Required for GitHub Pages deployment
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                services: resolve(__dirname, 'services.html'),
                clarityCall: resolve(__dirname, 'clarity-call.html'),
                events: resolve(__dirname, 'events.html'),
                podcast: resolve(__dirname, 'podcast.html'),
                contact: resolve(__dirname, 'contact.html'),
                legal: resolve(__dirname, 'legal.html'),
            },
        },
    },
});
