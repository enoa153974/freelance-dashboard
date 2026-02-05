// utils/time.js

//タイマー表示用関数

export function formatSecondsHMS(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h}h ${m}m ${s}s`;
}

//作業時間計測タイマー用ロジック
const TIMER_KEY = 'work-timer';

export function initWorkTimer({
    displayEl,
    startBtn,
    stopBtn,
    resetBtn
}) {
    if (!displayEl) return;

    let timer = load();
    let intervalId = null;

    render();
    if (timer.running) startInterval();

    /* ========= イベント ========= */

    startBtn?.addEventListener('click', () => {
        if (timer.running) return;

        timer.running = true;
        timer.startAt = Date.now();
        save();
        startInterval();
    });

    stopBtn?.addEventListener('click', () => {
        if (!timer.running) return;

        timer.elapsed += Math.floor((Date.now() - timer.startAt) / 1000);
        timer.running = false;
        timer.startAt = null;
        save();
        stopInterval();
        render();
    });

    resetBtn?.addEventListener('click', () => {
        timer = {
            startAt: null,
            elapsed: 0,
            running: false
        };
        save();
        stopInterval();
        render();
    });

    /* ========= 内部 ========= */

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

    function save() {
        localStorage.setItem(TIMER_KEY, JSON.stringify(timer));
    }

    function load() {
        return JSON.parse(localStorage.getItem(TIMER_KEY)) || {
            startAt: null,
            elapsed: 0,
            running: false
        };
    }
}

//今の秒数を返す関数
export function getCurrentTimerSeconds() {
    const timer = JSON.parse(localStorage.getItem('work-timer'));
    if (!timer) return 0;

    if (!timer.running) return timer.elapsed;

    return timer.elapsed + Math.floor((Date.now() - timer.startAt) / 1000);
}


//タイマーをリセットする関数
export function resetTimer() {
    localStorage.setItem('work-timer', JSON.stringify({
        startAt: null,
        elapsed: 0,
        running: false
    }));
}