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
import { initDailyTodo } from './ui/dailyTodo.js';
import { initStockTodo } from './ui/stockTodo.js';
import { initTodayLog } from './ui/todayLog.js';
import { initWorkTimer } from './utils/time.js';
import { initNav } from './ui/nav.js';
import { openOverlay, initOverlay } from "./ui/overlay.js";
import { initSaveWizard } from './ui/saveWizard.js';
import { loadRules } from "./modules/rulesViewer.js";
import { loadFlows } from "./modules/flowsViewer.js";

//import './switchPanel.js';
//import './panel.js';
//import { hamburger } from './hamburger.js';


window.addEventListener('DOMContentLoaded', async () => {
    // HTML読み込みが終わったあとに実行される処理
    //hamburger();
    //initWeather();

    // ServiceWorker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js');
    }

    initClock();

    initDailyTodo({
        listEl: document.getElementById('daily-list'),
        formEl: document.getElementById('memo-form'),
        inputEl: document.getElementById('memo-input'),
        clearBtn: document.getElementById('memo-clear'),
        moveBtn: document.getElementById('move-to-stock'),
        storageKey: 'daily-todo',
        stockKey: 'stock-todo'
    });

    initStockTodo({
        listEl: document.getElementById('stock-list'),
        clearDoneBtn: document.getElementById('clear-done-stock'),
        storageKey: 'stock-todo',
        dailyKey: 'daily-todo'
    });


    initTodayLog({
        listEl: document.getElementById('today-log-list'),
        totalEl: document.getElementById('today-total-time')
    });

    initWorkTimer({
        displayEl: document.getElementById('timer-display'),
        startBtn: document.getElementById('timer-start'),
        stopBtn: document.getElementById('timer-stop'),
        resetBtn: document.getElementById('timer-reset')
    });

    initNav();

    initOverlay();

});


document.getElementById("openSaveWizard").onclick = () => {

    openOverlay({
        html: document.getElementById("saveWizardTemplate").innerHTML,

        onOpen() {
            initSaveWizard({
                root: document.getElementById("overlayContent")
            });
        }
    });


};

document.getElementById("openRules").onclick = async () => {

    openOverlay({
        html: `<pre>${await loadRules()}</pre>`
    });

};

document.getElementById("openFlows").onclick = async () => {

    openOverlay({
        html: `<pre>${await loadFlows()}</pre>`
    });

};