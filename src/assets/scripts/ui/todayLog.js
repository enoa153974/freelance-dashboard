// todayLog.js
import { getToday } from "../utils/date.js";
import { formatSecondsHMS } from "../utils/time.js";
import {
    load as loadStorage,
    save as saveStorage,
} from "../storage/storage.js";
import { qs } from "../utils/dom.js";
import { saveTodayToWorkLog } from "./dailyTodo.js";

export function initTodayLog({
    listEl,
    totalEl,
    dailyKey = "daily-todo",
    stockKey = "stock-todo",
    emptyText = "今日はまだ完了タスクがありません",
}) {
    if (!listEl) return;

    render();
    window.addEventListener("todo:updated", render);

    function render() {
        listEl.innerHTML = "";

        const today = getToday();
        const logs = loadStorage("today-log") || [];
        // NOTE: stockTodoのlogsもコンプリートタスクに入るようにあとで戻す
        const stock = loadStorage(stockKey) || [];

        const todayDone = logs.filter((log) => log.completedAt === today);

        /* ===== 合計作業時間 ===== */
        const totalSeconds = todayDone.reduce(
            (sum, t) => sum + (t.workTime || 0),
            0,
        );

        if (totalEl) {
            totalEl.textContent = formatSecondsHMS(totalSeconds);
        }

        if (todayDone.length === 0) {
            const li = document.createElement("li");
            li.className = "today-log-empty";
            li.textContent = emptyText;
            listEl.appendChild(li);
            return;
        }

        todayDone.forEach((t) => {
            const li = document.createElement("li");
            li.className = "today-log-item";
            li.dataset.id = t.id;

            const time = t.workTime ? `（${formatSecondsHMS(t.workTime)}）` : "";

            li.innerHTML = `
        <span class="today-log-label">${t.label} ${time}</span>
        <button class="today-log-delete" aria-label="ログ削除">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;

            //個別削除ボタン
            const deleteBtn = qs(".today-log-delete", li);

            deleteBtn.addEventListener("click", () => {

                if (!confirm("このログを削除しますか？")) return;

                const id = li.dataset.id;

                const logs = loadStorage("today-log") || [];

                const newLogs = logs.filter(log => log.id !== id);

                saveStorage("today-log", newLogs);

                render();
            });

            listEl.appendChild(li);
        });

    }


    //完了済みをログに全保存ボタン
    // NOTE: ここでfirestoreデータベースにログを格納
    const saveBtn = qs("#completed-log-save", document);

    saveBtn?.addEventListener("click", async () => {
        const logs = loadStorage("today-log") || [];

        // 🔥 保存可能なログがあるかチェック
        const hasValid = logs.some(log => log.workTime > 0);

        if (!hasValid) {
            alert("作業時間が記録されたログがありません");
            return;
        }

        if (!confirm("完了済みのログをすべて保存しますか？")) return;

        // ① ローディング開始
        saveBtn.disabled = true;
        const originalText = saveBtn.textContent;
        saveBtn.textContent = "保存中...";

        try {
            await saveTodayToWorkLog();

            // ② 成功
            saveBtn.textContent = "保存完了！";

            // 少しだけ表示してから戻す
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.disabled = false;
            }, 1000);

            render();

        } catch (e) {
            console.error(e);

            // ③ エラー
            saveBtn.textContent = "失敗しました";

            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.disabled = false;
            }, 1500);

            alert("通信エラーが発生しました");
        }
    });
}
