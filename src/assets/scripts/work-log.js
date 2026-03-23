/**
work-logページで使う処理をここに書く
 */

import '../styles/style.scss';
import { initClock } from './ui/clock.js';
import { fetchLogs } from './services/logs.js';
import { groupByDate } from './utils/group.js';
import { qs } from "./utils/dom.js";
import { initHamburger } from "./ui/hamburger.js";



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


    initHamburger();

    initClock();



    const listEl = document.getElementById('work-log-list');

    init();

    async function init() {
        //データベースからlogsを取得
        const logs = await fetchLogs();

        render(logs);
    }

    /**
     * 秒（logs.time）を 変換 →  時:分:秒
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

        //ログがない場合
        if (!logs.length) {
            listEl.innerHTML = '<li>ログがありません</li>';
            return;
        }


        // ===============================
        // 🔥 全体合計
        // ===============================
        const totalSec = logs.reduce((sum, log) => {
            return sum + (log.time || 0);
        }, 0);

        const formattedTotal = formatTime(totalSec);

        const totalEl = qs('.work-time-total-amount', document);
        if (totalEl) {
            totalEl.textContent = formattedTotal;
        }

        //ログをグループ分け
        const grouped = groupByDate(logs);
        Object.keys(grouped)
            .sort((a, b) => b.localeCompare(a))
            .forEach(date => {



                // ===============================
                // 日別合計
                // ===============================
                const dayTotalSec = grouped[date].reduce((sum, log) => {
                    return sum + (log.time || 0);
                }, 0);

                const formattedDayTotal = formatTime(dayTotalSec);

                const section = document.createElement('li');

                section.innerHTML = `
            <h3 class="work-date">${date}</h3>

            <div class="work-time-daytotal">
                合計作業時間：<span class="work-time-amount">${formattedDayTotal}</span>
            </div>

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
})

