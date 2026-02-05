// stockTodo.js
// 「未達成タスク（ストック）」を管理・表示するモジュール
// Daily から送られてきたタスクを保持し、完了・戻す・一括削除を担当

import { addToDailyTodo } from './dailyTodo.js';
import { getToday } from '../utils/date.js';
import { getCurrentTimerSeconds, resetTimer } from '../utils/time.js';

/**
 * Stock Todo 初期化
 * @param {HTMLElement} listEl - 未達成タスクを表示する ul 要素
 * @param {HTMLElement} clearDoneBtn - 完了済みを一括削除するボタン
 * @param {string} storageKey - localStorage のキー（stock 側）
 * @param {string} dailyKey - Daily 側の localStorage キー
 * @param {string} emptyText - タスクが空のときに表示する文言
 */
export function initStockTodo({
    listEl,
    clearDoneBtn,
    storageKey = 'stock-todo',
    dailyKey = 'daily-todo',
    emptyText = '未達成タスクはありません'
}) {
    // 表示先がなければ何もしない（安全ガード）
    if (!listEl) return;

    // localStorage から Stock タスクを読み込み
    let todos = load();

    // 初期描画
    render();

    /* =========================
       完了済み一括削除ボタン
    ========================= */
    clearDoneBtn?.addEventListener('click', () => {
        // 完了済みが1件もなければ何もしない
        const hasDone = todos.some(todo => todo.done);
        if (!hasDone) return;

        // 誤爆防止の確認ダイアログ
        const ok = window.confirm('完了済みタスクを削除しますか？');
        if (!ok) return;

        // 完了済み（done === true）を除外
        todos = todos.filter(todo => !todo.done);

        // 保存して再描画
        save();
        render(); // ← disabled 状態もここで更新される
    });

    /* =========================
       他画面（Daily）からの更新通知
       localStorage は変わるが、
       JS の todos は自動更新されないため
       カスタムイベントで同期する
    ========================= */
    window.addEventListener('todo:updated', () => {
        todos = load();
        render();
    });

    /* =========================
       描画処理
    ========================= */
    function render() {
        // 一旦中身を空にする
        listEl.innerHTML = '';

        // タスクが0件の場合
        if (todos.length === 0) {
            const li = document.createElement('li');
            li.className = 'stock-empty';
            li.textContent = emptyText;
            listEl.appendChild(li);
            return;
        }

        // タスクを1件ずつ描画
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'stock-item py-1';

            // 完了済みなら見た目用クラスを付与
            if (todo.done) li.classList.add('is-done');

            li.dataset.id = todo.id;

            // タスク表示（チェック + ラベル + 戻すボタン）
            li.innerHTML = `
                <div class="stock-main flex justify-between">
                    <label class="stock-check">
                        <input
                            type="checkbox"
                            class="stock-done"
                            ${todo.done ? 'checked' : ''}
                        />
                        <span class="stock-label">${todo.label}</span>
                    </label>

                    <div class="stock-actions ml-4 rounded bg-accent text-center">
                        <button class="stock-back" title="今日に戻す">↩</button>
                    </div>
                </div>
            `;

            /* --- 今日に戻す処理 --- */
            li.querySelector('.stock-back').addEventListener('click', () => {
                // Daily 側に未達成として追加
                addToDailyTodo({
                    label: todo.label,
                    storageKey: dailyKey
                });

                // Stock 側からは削除
                removeFromStock(todo.id);

                // Daily / Stock 両方に再描画を通知
                window.dispatchEvent(new CustomEvent('todo:updated'));
            });

            /* --- 完了チェック --- */
            // チェックしてもその場には残る（見た目だけ変わる）
            li.querySelector('.stock-done').addEventListener('change', e => {
                const checked = e.target.checked;

                if (checked) {
                    todo.done = true;
                    todo.completedAt = getToday();
                    todo.workTime = getCurrentTimerSeconds();

                    resetTimer();
                } else {
                    todo.done = false;
                    todo.completedAt = null;
                    todo.workTime = null;
                }

                save();
                render();

                window.dispatchEvent(new CustomEvent('todo:updated'));
            });


            listEl.appendChild(li);
        });

        // 完了済みがあるときだけ一括削除ボタンを有効化
        if (clearDoneBtn) {
            clearDoneBtn.disabled = !todos.some(todo => todo.done);
        }
    }

    /* =========================
       タスク削除（Stock → Daily 移動時）
    ========================= */
    function removeFromStock(id) {
        todos = todos.filter(todo => todo.id !== id);
        save();
        render();
    }

    /* =========================
       localStorage 操作
    ========================= */
    function save() {
        localStorage.setItem(storageKey, JSON.stringify(todos));
    }

    function load() {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    }
}
