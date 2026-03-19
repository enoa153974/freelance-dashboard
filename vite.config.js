import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import path from 'path';
import { resolve } from 'path';

// ===============================
// ■ マルチHTML設定（root基準）
// ===============================
const inputs = {
    main: resolve(__dirname, 'index.html'),
    'work-log': resolve(__dirname, 'work-log/index.html'),
    'hint': resolve(__dirname, 'hint/index.html'),
};

// ========================================
// Vite 設定本体
// ========================================
export default defineConfig({

    base: '/',

    plugins: [
        handlebars({
            partialDirectory: path.resolve(__dirname, 'src/partials'),
        }),
    ],

    build: {
        outDir: 'dist',
        emptyOutDir: true,
        assetsDir: 'assets',
        minify: false,
        sourcemap: false,

        rollupOptions: {
            input: inputs,

            output: {
                entryFileNames: 'assets/js/[name].js',
                chunkFileNames: 'assets/js/[name].js',

                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'assets/css/style.css';
                    }
                    return 'assets/[name][extname]';
                },
            },
        },
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },

    server: {
        open: true,
        host: true,
        port: 5173,
        watch: {
            usePolling: true,
        },
    },
});