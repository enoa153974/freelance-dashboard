/**
 * clock.js
 * 
 * ・デジタル時計（HH:MM）
 * ・日付（YYYY/MM/DD（曜日））
 * ・1秒ごとに更新
 */

export function initClock() {
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');

    // 対象要素がなければ何もしない（安全策）
    if (!clockEl || !dateEl) return;

    const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

    function updateClock() {
        const now = new Date();

        // 時刻
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        clockEl.textContent = `${hours}:${minutes}`;

        // 日付
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const weekday = WEEKDAYS[now.getDay()];

        dateEl.textContent = `${year}/${month}/${day}（${weekday}）`;
    }

    // 初回即実行
    updateClock();

    // 1秒ごとに更新
    setInterval(updateClock, 1000);
}
