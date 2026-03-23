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
import { initHamburger } from "./ui/hamburger.js";
import { db } from './firebase.js';
import { collection, addDoc } from "firebase/firestore";

//import './switchPanel.js';
//import './panel.js';
//import { hamburger } from './hamburger.js';


window.addEventListener('DOMContentLoaded', async () => {
    // HTML読み込みが終わったあとに実行される処理
    if (!document.body.classList.contains('page-home')) return;

    //initWeather();

    // ServiceWorker
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/service-worker.js")
                .then(() => console.log("SW registered"))
                .catch(err => console.log("SW error", err));
        });
    }



    initHamburger();
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


const btn = document.getElementById("openSaveWizard");

if (btn) {
    btn.onclick = () => {
        openOverlay({
            html: document.getElementById("saveWizardTemplate").innerHTML,
            onOpen() {
                initSaveWizard({
                    root: document.getElementById("overlayContent")
                });
            }
        });
    };
}

const rulesBtn = document.getElementById("openRules");

if (rulesBtn) {
    rulesBtn.onclick = async () => {
        openOverlay({
            html: `<pre>${await loadRules()}</pre>`
        });
    };
}

const flowsBtn = document.getElementById("openFlows");

if (flowsBtn) {
    flowsBtn.onclick = async () => {
        openOverlay({
            html: `<pre>${await loadFlows()}</pre>`
        });
    };
}