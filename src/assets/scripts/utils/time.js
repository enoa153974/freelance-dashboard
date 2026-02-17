import { save as saveStorage, load as loadStorage } from "../storage/storage.js";

/* ========================================
   秒 → h m s 表示変換
======================================== */
export function formatSecondsHMS(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h}h ${m}m ${s}s`;
}

/* ========================================
   タイマーキー
======================================== */
const TIMER_KEY = "work-timer";

/* ========================================
   初期化
======================================== */
export function initWorkTimer({
    displayEl,
    startBtn,
    stopBtn,
    resetBtn
}) {
    if (!displayEl) return;

    let timer = loadTimer();
    let intervalId = null;

    render();

    if (timer.running) startInterval();

    /* ========= イベント ========= */

    startBtn?.addEventListener("click", () => {
        if (timer.running) return;

        timer.running = true;
        timer.startAt = Date.now();
        saveTimer();
        startInterval();
    });

    stopBtn?.addEventListener("click", () => {
        if (!timer.running) return;

        timer.elapsed += Math.floor((Date.now() - timer.startAt) / 1000);
        timer.running = false;
        timer.startAt = null;

        saveTimer();
        stopInterval();
        render();
    });

    resetBtn?.addEventListener("click", () => {
        timer = createInitialTimer();
        saveTimer();
        stopInterval();
        render();
    });

    /* ========= 内部関数 ========= */

    function startInterval() {
        stopInterval();
        intervalId = setInterval(render, 1000);
    }

    function stopInterval() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function getCurrentSeconds() {
        if (!timer.running) return timer.elapsed;
        return timer.elapsed + Math.floor((Date.now() - timer.startAt) / 1000);
    }

    function render() {
        displayEl.textContent = formatSecondsHMS(getCurrentSeconds());
    }

    function saveTimer() {
        saveStorage(TIMER_KEY, timer);
    }

    function loadTimer() {
        return loadStorage(TIMER_KEY) || createInitialTimer();
    }

    function createInitialTimer() {
        return {
            startAt: null,
            elapsed: 0,
            running: false
        };
    }
}

/* ========================================
   現在秒数取得（他モジュール用）
======================================== */
export function getCurrentTimerSeconds() {
    const timer = loadStorage(TIMER_KEY);
    if (!timer) return 0;

    if (!timer.running) return timer.elapsed;

    return timer.elapsed + Math.floor((Date.now() - timer.startAt) / 1000);
}

/* ========================================
   タイマーリセット（外部用）
======================================== */
export function resetTimer() {
    saveStorage(TIMER_KEY, {
        startAt: null,
        elapsed: 0,
        running: false
    });
}
