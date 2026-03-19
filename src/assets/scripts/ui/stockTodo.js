// stockTodo.js
// 未達成タスク専用（Stock）
// Dailyに戻すだけのシンプルな設計

import { addToDailyTodo } from './dailyTodo.js';
import { save as saveStorage, load as loadStorage } from "../storage/storage.js";
import { enableTouchSort } from "../common/touchSort.js";

export function initStockTodo({
    listEl,
    storageKey = 'stock-todo',
    dailyKey = 'daily-todo',
    emptyText = '未達成タスクはありません'
}) {
    if (!listEl) return;

    let todos = load();
    //ソート用state
    const sortState = {
        isReordering: false,
    };

    render();

    /* =========================
        他画面との同期
    ========================= */
    window.addEventListener('todo:updated', () => {
        todos = load();
        render();
    });

    /* =========================
        描画
    ========================= */
    function render() {
        listEl.innerHTML = '';

        if (todos.length === 0) {
            const li = document.createElement('li');
            li.className = 'stock-empty';
            li.textContent = emptyText;
            listEl.appendChild(li);
            return;
        }

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'stock-item py-1';
            li.dataset.id = todo.id;

            li.innerHTML = `
                <div class="stock-main flex justify-between items-center">
                    <span class="stock-label">${todo.label}</span>

                    <div class="stock-actions ml-4 rounded bg-accent text-center">
                        <button class="stock-back" title="今日に戻す">↩</button>
                    </div>
                </div>
            `;

            /* --- 今日に戻す --- */
            li.querySelector('.stock-back').addEventListener('click', () => {
                addToDailyTodo({
                    label: todo.label,
                    storageKey: dailyKey
                });

                removeFromStock(todo.id);

                window.dispatchEvent(new CustomEvent('todo:updated'));
            });

            listEl.appendChild(li);
        });

        //並び替え有効化
        enableTouchSort(listEl, saveOrder, sortState, ".stock-item");
    }

    /* =========================
        削除
    ========================= */
    function removeFromStock(id) {
        todos = todos.filter(todo => todo.id !== id);
        save();
        render();
    }

    /* =========================
        localStorage
    ========================= */
    function save() {
        saveStorage(storageKey, todos);
    }

    function load() {
        return loadStorage(storageKey) || [];
    }
}

// ------------------------------
// ◆ 並び順を管理する関数
// ------------------------------

function saveOrder() {
    const items = listEl.querySelectorAll(".stock-item");

    const order = [...items].map(item => item.dataset.id);

    // id順で並び替え
    todos.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

    save();
}