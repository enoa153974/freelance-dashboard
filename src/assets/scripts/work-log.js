/**
work-logページで使う処理をここに書く
 */

import '../styles/style.scss';
import { initClock } from './ui/clock.js';
import { fetchLogs } from './services/logs.js';
import { groupByDate } from './utils/group.js';




window.addEventListener('DOMContentLoaded', async () => {
    // HTML読み込みが終わったあとに実行される処理
    //hamburger();
    //initWeather();

    // ServiceWorker
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/service-worker.js")
                .then(() => console.log("SW registered"))
                .catch(err => console.log("SW error", err));
        });
    }



    initClock();



    const listEl = document.getElementById('work-log-list');

    init();

    async function init() {
        const logs = await fetchLogs();

        render(logs);
    }

    /**
     * 秒 → 時:分:秒
     */
    function formatTime(sec) {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;

        return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    /**
     * 一覧表示
     */
    function render(logs) {
        listEl.innerHTML = '';

        if (!logs.length) {
            listEl.innerHTML = '<li>ログがありません</li>';
            return;
        }

        const grouped = groupByDate(logs);

        Object.keys(grouped)
            .sort((a, b) => b.localeCompare(a)) // 新しい日付が上
            .forEach(date => {
                const section = document.createElement('li');

                section.innerHTML = `
                <h3 class="work-date">${date}</h3>
                <ul>
                    ${grouped[date].map(log => `
                        <li>
                            <strong class="work-name">${log.taskName}</strong>
                            ⏱ ${formatTime(log.time)}
                        </li>
                    `).join('')}
                </ul>
            `;

                listEl.appendChild(section);
            });
    }
});

