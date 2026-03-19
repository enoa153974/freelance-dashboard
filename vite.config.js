// vite.config.js
// ========================================
// 納品前ビルド用 Vite 設定
// ・HTML / CSS / JS を素の状態で出力
// ・Vite / Sass / Handlebars は開発時のみ使用
// ========================================

import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import path from 'path';
import { resolve } from 'path';
import fs from 'fs';

// ===============================
// ■ マルチHTML設定
// ===============================
const pagesDir = resolve(__dirname, 'src/pages');

const inputs = {
    main: resolve(__dirname, 'index.html'),
};

if (fs.existsSync(pagesDir)) {
    fs.readdirSync(pagesDir).forEach(file => {
        const fullPath = resolve(pagesDir, file);

        // 直下HTML
        if (file.endsWith('.html')) {
            const name = file.replace('.html', '');
            inputs[name] = fullPath;
        }
    });
}

console.log(inputs);
// ========================================
// Vite 設定本体
// ========================================
export default defineConfig({

    // ------------------------------------
    // Vercel / 静的サーバー向け
    // ルート基準でパスを解決
    // ------------------------------------
    base: '/',

    // ------------------------------------
    // プラグイン
    // Handlebars：HTMLの partial / include 用
    // ------------------------------------
    plugins: [
        handlebars({
            partialDirectory: path.resolve(__dirname, 'src/partials'),
        }),

        {
            name: 'custom-routing',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {

                    // pages/配下のhtmlファイル を src/pages にリダイレクト
                    const routes = {
                        '/work-log.html': '/src/pages/work-log.html',
                        '/hint.html': '/src/pages/hint.html',
                    };

                    if (routes[req.url]) {
                        req.url = routes[req.url];
                    }

                    next();
                });
            }
        }
    ],
    // ------------------------------------
    // ビルド設定（＝最終納品物の形）
    // ------------------------------------
    build: {
        // 出力先フォルダ
        outDir: 'dist',

        // 毎回 dist を空にしてからビルド
        emptyOutDir: true,

        // assets フォルダ名
        assetsDir: 'assets',

        // 納品前提なので minify しない
        //（必要なら true にしてOK）
        minify: false,

        // ソースマップは不要
        sourcemap: false,

        // Rollup 詳細設定
        rollupOptions: {
            // マルチHTMLのエントリ
            input: inputs,

            // 出力ファイル名を「固定名」にする
            // → FTP納品 / クライアント納品向け
            output: {
                // 各HTMLに対応するJS
                // index.html → assets/js/main.js
                // work-log.html → assets/js/work-log.js
                entryFileNames: 'assets/js/[name].js',

                // 共通チャンク（vendorなど）
                chunkFileNames: 'assets/js/[name].js',

                // CSSや画像などのアセット
                assetFileNames: (assetInfo) => {
                    // CSSは1ファイルにまとめる
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'assets/css/style.css';
                    }

                    // その他（画像・フォントなど）
                    return 'assets/[name][extname]';
                },
            },
        },
    },

    // ------------------------------------
    // import のパス短縮用エイリアス
    // ------------------------------------
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },

    // ------------------------------------
    // ローカル開発サーバー設定
    // ------------------------------------
    server: {
        open: true,        // 起動時にブラウザを開く
        host: true,        // LANアクセス可
        port: 5173,
        watch: {
            usePolling: true, // 環境依存の監視対策
        },

    },
});