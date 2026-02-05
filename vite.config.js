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

// ========================================
// マルチHTML対応設定
// src/pages 配下の html を自動でビルド対象にする
// ========================================

// 下層ページのディレクトリ
const pagesDir = resolve(__dirname, 'src/pages');

// Vite / Rollup に渡す input 定義
// index.html は常にエントリに含める
const inputs = {
    main: resolve(__dirname, 'index.html'),
};

// src/pages が存在する場合のみ処理
if (fs.existsSync(pagesDir)) {
    fs.readdirSync(pagesDir).forEach(file => {
        if (file.endsWith('.html')) {
            // pages/yuuma.html → yuuma
            const name = file.replace('.html', '');
            inputs[name] = resolve(pagesDir, file);
        }
    });
}

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
            // partial の置き場所
            partialDirectory: path.resolve(__dirname, 'src/partials'),
        }),
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
                // yuuma.html → assets/js/yuuma.js
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