/**
 * main.js
 * 
 * jsファイルのエントリーポイント
 * - Sass/CSSや必要なJSをここでまとめて読み込む
 * - メインページ全体で使う処理をここに書く
 * - DOMContentLoaded
 * - 初期化処理の呼び出し
 */

import '../styles/style.scss';
import { initClock } from './ui/clock.js';
import { initWeather } from './ui/weather.js';
import { initGarbage } from './ui/garbage.js';
import { initMemo } from './ui/memo.js';
import { initNav } from './ui/nav.js';


//import './switchPanel.js';
//import './panel.js';
//import { hamburger } from './hamburger.js';

/* Service Worker を登録 */
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}

window.addEventListener('DOMContentLoaded', () => {
    // HTML読み込みが終わったあとに実行される処理
    //hamburger();
    initClock();
    initWeather();
    initGarbage();
    initMemo();
    initNav();
});