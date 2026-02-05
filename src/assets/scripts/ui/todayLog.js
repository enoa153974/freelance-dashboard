// todayLog.js
import { getToday } from '../utils/date.js';
import { formatSecondsHMS } from '../utils/time.js';

export function initTodayLog({
    listEl,
    totalEl,
    dailyKey = 'daily-todo',
    stockKey = 'stock-todo',
    emptyText = '今日はまだ完了タスクがありません'
}) {
    if (!listEl) return;

    render();
    window.addEventListener('todo:updated', render);

    function render() {
        listEl.innerHTML = '';

        const today = getToday();
        const daily = load(dailyKey);
        const stock = load(stockKey);

        const todayDone = [...daily, ...stock].filter(
            t => t.done && t.completedAt === today
        );

        /* ===== 合計作業時間 ===== */
        const totalSeconds = todayDone.reduce(
            (sum, t) => sum + (t.workTime || 0),
            0
        );

        if (totalEl) {
            totalEl.textContent = formatSecondsHMS(totalSeconds);
        }

        if (todayDone.length === 0) {
            const li = document.createElement('li');
            li.className = 'today-log-empty';
            li.textContent = emptyText;
            listEl.appendChild(li);
            return;
        }

        todayDone.forEach(t => {
            const li = document.createElement('li');
            li.className = 'today-log-item';

            const time = t.workTime
                ? `（${formatSecondsHMS(t.workTime)}）`
                : '';

            li.textContent = `${t.label} ${time}`;
            listEl.appendChild(li);
        });
    }

    function load(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }
}
