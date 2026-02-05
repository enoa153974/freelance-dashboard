/**
 * garbage.js
 *
 * ゴミの日を曜日で判定して表示する
 */

export function initGarbage() {
    const commentEl = document.getElementById('garbage-comment');
    if (!commentEl) return;

    // 曜日ごとのゴミ設定（必要に応じて変える）
    const GARBAGE_SCHEDULE = {
        1: 'ごみ',   // 月
        2: 'ビン・カン・段ボール', // 火
        4: 'ごみ',   // 木
        5: 'プラ',   // 金
    };

    const today = new Date();
    const day = today.getDay(); // 0=日, 1=月, ...

    const garbageType = GARBAGE_SCHEDULE[day];

    if (garbageType) {
        commentEl.textContent = `今日は「${garbageType}」の日です！`;
    } else {
        commentEl.textContent = '今日はゴミの日ではありません';
    }
}
