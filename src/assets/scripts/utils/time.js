import { save as saveStorage, load as loadStorage } from "../storage/storage.js";

/* ==================================================
   秒 → h m s 表示変換
   -----------------------------------------------
   例: 3661 → "1h 1m 1s"
================================================== */
export function formatSecondsHMS(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h}h ${m}m ${s}s`;
}

/* ==================================================
   ストレージキー
================================================== */
const TIMER_KEY = "work-timer";

/* ==================================================
   タイマー初期化
   -----------------------------------------------
   - 表示
   - 開始/停止/リセット
   - 手動編集
   - 自動保存（localStorage）
================================================== */
export function initWorkTimer({
    displayEl,
    startBtn,
    stopBtn,
    resetBtn
}) {
    if (!displayEl) return;

    // 保存済み状態をロード
    let timer = loadTimer();
    let intervalId = null;

    // 初期描画
    render();

    // ページリロード後も動作中なら再開
    if (timer.running) startInterval();

    /* ===============================
       ボタンイベント
    =============================== */

    // ▶ 開始
    startBtn?.addEventListener("click", () => {
        if (timer.running) return;

        timer.running = true;
        timer.startAt = Date.now();
        saveTimer();
        startInterval();
    });

    // ■ 停止
    stopBtn?.addEventListener("click", () => {
        if (!timer.running) return;

        // 経過秒数を確定
        timer.elapsed += Math.floor((Date.now() - timer.startAt) / 1000);
        timer.running = false;
        timer.startAt = null;

        saveTimer();
        stopInterval();
        render();
    });

    // ⟲ リセット
    resetBtn?.addEventListener("click", () => {
        timer = createInitialTimer();
        saveTimer();
        stopInterval();
        render();
    });

    /* ===============================
       内部ロジック
    =============================== */

    // インターバル開始
    function startInterval() {
        stopInterval();
        intervalId = setInterval(render, 1000);
    }

    // インターバル停止
    function stopInterval() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    // 現在秒数を取得
    function getCurrentSeconds() {
        if (!timer.running) return timer.elapsed;
        return timer.elapsed + Math.floor((Date.now() - timer.startAt) / 1000);
    }

    // 表示更新
    function render() {
        displayEl.textContent = formatSecondsHMS(getCurrentSeconds());
    }

    // 保存
    function saveTimer() {
        saveStorage(TIMER_KEY, timer);
    }

    // 読み込み
    function loadTimer() {
        return loadStorage(TIMER_KEY) || createInitialTimer();
    }

    // 初期状態生成
    function createInitialTimer() {
        return {
            startAt: null,
            elapsed: 0,
            running: false
        };
    }

    /* ==================================================
       手動編集機能
       -----------------------------------------------
       - 停止中のみ編集可能
       - クリックで input 化
       - Enterで保存 / Escでキャンセル
    ================================================== */

    function enableEdit() {

        if (timer.running) return; // 動作中は編集禁止

        const current = getCurrentSeconds();

        // 入力フィールド生成
        const input = document.createElement("input");
        input.type = "text";
        input.value = secondsToHHMMSS(current);
        input.className = "timer-edit";

        // 表示を input に置き換え
        displayEl.replaceWith(input);
        input.focus();
        input.select();

        input.addEventListener("blur", saveEdit);

        input.addEventListener("keydown", e => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") cancelEdit();
        });

        // 保存処理
        function saveEdit() {
            const sec = parseHHMMSS(input.value);

            timer.elapsed = sec;
            timer.startAt = null;
            timer.running = false;

            saveTimer();

            input.replaceWith(displayEl);
            render();
        }

        // キャンセル処理
        function cancelEdit() {
            input.replaceWith(displayEl);
        }
    }

    /* ===============================
       秒数 ⇄ HH:MM:SS 変換
    =============================== */

    function secondsToHHMMSS(sec) {
        const h = String(Math.floor(sec / 3600)).padStart(2, "0");
        const m = String(Math.floor(sec % 3600 / 60)).padStart(2, "0");
        const s = String(sec % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    }

    function parseHHMMSS(str) {
        const [h = 0, m = 0, s = 0] = str.split(":").map(n => parseInt(n) || 0);
        return h * 3600 + m * 60 + s;
    }

    // 表示クリックで編集モード
    displayEl.addEventListener("click", enableEdit);
}

/* ==================================================
   他モジュール用：現在秒数取得
================================================== */
export function getCurrentTimerSeconds() {
    const timer = loadStorage(TIMER_KEY);
    if (!timer) return 0;

    if (!timer.running) return timer.elapsed;

    return timer.elapsed + Math.floor((Date.now() - timer.startAt) / 1000);
}

/* ==================================================
   外部用リセット
================================================== */
export function resetTimer() {
    saveStorage(TIMER_KEY, {
        startAt: null,
        elapsed: 0,
        running: false
    });
}