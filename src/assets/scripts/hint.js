import '../styles/style.scss';
import { initClock } from './ui/clock.js';
import { initCopyButtons } from "./utils/button.js";
import { initHamburger } from "./ui/hamburger.js";

window.addEventListener('DOMContentLoaded', async () => {
    // HTML読み込みが終わったあとに実行される処理

    // ServiceWorker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js');
    }

    //ヘッダーの時計
    initClock();
    //ハンバーガーメニュー
    initHamburger();
    initCopyButtons();
})