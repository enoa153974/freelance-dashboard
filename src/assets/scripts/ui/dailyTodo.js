// dailyTodo.js
// 「本日のやること（Daily Todo）」を管理するモジュール
// 追加・完了管理・未達成を Stock に送る役割を持つ

import { getToday } from "../utils/date.js";
import { getCurrentTimerSeconds, resetTimer } from "../utils/time.js";
import { addClass } from "../utils/dom.js";
import {
    save as saveStorage,
    load as loadStorage,
} from "../storage/storage.js";
import { enableTouchSort } from "../common/touchSort.js";

// Daily / Stock 間の更新同期に使うカスタムイベント名
const TODO_UPDATE_EVENT = "todo:updated";

/**
 * Daily Todo 初期化
 * @param {HTMLElement} listEl - Daily タスク一覧を表示する ul 要素
 * @param {HTMLFormElement} formEl - タスク追加用フォーム
 * @param {HTMLInputElement|HTMLTextAreaElement} inputEl - タスク入力欄
 * @param {HTMLElement} moveBtn - 未達成タスクを Stock に送るボタン
 * @param {HTMLElement} clearBtn - Daily タスクを全削除するボタン
 * @param {string} storageKey - localStorage のキー（Daily 側）
 * @param {string} stockKey - localStorage のキー（Stock 側）
 */

export function initDailyTodo({
    listEl,
    formEl,
    inputEl,
    moveBtn,
    clearBtn,
    storageKey = "daily-todo",
    stockKey = "stock-todo",
}) {
    // 必須要素がなければ何もしない（安全ガード）
    if (!listEl || !formEl || !inputEl) return;

    // localStorage から Daily タスクを読み込み
    let todos = loadDaily();
    //ソート用のstateを追加
    const sortState = {
        isReordering: false,
    };

    // 初期描画
    render();

    /* =========================
          他画面（Stock）からの更新通知
          localStorage は更新されても、
          JS 内の todos は自動で変わらないため
          カスタムイベントで再読み込みする
      ========================= */
    window.addEventListener(TODO_UPDATE_EVENT, () => {
        todos = loadDaily();
        render();
    });

    /* =========================
          イベント
      ========================= */

    /* --- タスク追加 --- */
    formEl.addEventListener("submit", (e) => {
        e.preventDefault();

        const text = inputEl.value.trim();
        if (!text) return;

        // 新しいタスクを追加（未達成）
        todos.push({
            id: `t-${Date.now()}`,
            label: text,
            done: false,
            completedAt: null,
        });

        save();
        render();

        // 入力欄をクリア
        inputEl.value = "";
    });

    /* --- Daily 全リセット --- */
    clearBtn?.addEventListener("click", () => {
        todos = [];
        save();
        render();
    });

    /* --- 未達成タスクを Stock に移動 --- */
    moveBtn?.addEventListener("click", () => {
        // 未達成タスクだけ抽出
        const unfinished = getUnfinishedTodos();
        if (unfinished.length === 0) return;

        // Stock 側のタスクを読み込み
        const stockTodos = loadStock();

        // 未達成タスクを Stock 用データとして追加
        unfinished.forEach((todo) => {
            stockTodos.push({
                id: `s-${Date.now()}-${todo.id}`,
                label: todo.label,
                done: false,
                completedAt: null,
            });
        });

        // Stock 側を保存
        saveStock(stockTodos);

        // Daily 側には「完了済みだけ残す」
        todos = todos.filter((todo) => todo.done);

        save();
        render();

        // Daily / Stock 両方に更新を通知
        window.dispatchEvent(new CustomEvent(TODO_UPDATE_EVENT));
    });

    /* =========================
            描画処理
      ========================= */
    function render() {
        // 一旦リストを空にする
        listEl.innerHTML = "";

        // タスクを1件ずつ描画
        todos.forEach((todo) => {
            //liを取得
            const li = document.createElement("li");
            //クラス名を付ける
            li.className = "todo-item";
            //data-idを付ける
            li.dataset.id = todo.id;

            // 完了済みなら見た目用クラスを付与
            if (todo.done) addClass(li, "is-done");

            li.innerHTML = `
                <label class="todo-label">
                    <input type="checkbox" ${todo.done ? "checked" : ""}>
                    <span>${todo.label}</span>
                </label>
                    <button class="todo-delete pl-2" aria-label="タスク削除">
                        <i class="fa-solid fa-trash"></i>
                    </button>
            `;

            // 完了チェック（チェックしても消えない）
            li.querySelector("input").addEventListener("change", (e) => {
                const checked = e.target.checked;

                if (checked) {
                    todo.done = true;
                    todo.completedAt = getToday();
                    todo.workTime = getCurrentTimerSeconds();

                    addTodayLog(todo);
                    // タイマーを自動リセット
                    resetTimer();
                } else {
                    // やり直し
                    todo.done = false;
                    todo.completedAt = null;
                    todo.workTime = null;
                }

                save();
                render();
                window.dispatchEvent(new CustomEvent("todo:updated"));
            });

            // 削除ボタン
            li.querySelector(".todo-delete").addEventListener("click", () => {
                // 該当todo削除
                if (!confirm('このタスクを削除しますか？')) return;
                todos = todos.filter((t) => t.id !== todo.id);

                save();
                render();

                window.dispatchEvent(new CustomEvent(TODO_UPDATE_EVENT));
            });
            listEl.appendChild(li);
        });

        //ここで並び替えを再初期化
        enableTouchSort(listEl, saveOrder, sortState, ".todo-item");
    }

    /* =========================
          ロジック
      ========================= */

    // 未達成タスクのみ抽出
    function getUnfinishedTodos() {
        return todos.filter((todo) => !todo.done);
    }

    /* =========================
          localStorage 操作
      ========================= */

    function save() {
        saveStorage(storageKey, todos);
    }

    function loadDaily() {
        return loadStorage(storageKey) || [];
    }

    // ------------------------------
    // ◆Todoを localStorage から読み込む関数
    // ------------------------------

    function loadStock() {
        return JSON.parse(localStorage.getItem(stockKey)) || [];
    }

    // ------------------------------
    // ◆Todoを localStorage に保存する関数
    // ------------------------------

    function saveStock(stockTodos) {
        localStorage.setItem(stockKey, JSON.stringify(stockTodos));
    }

    // ------------------------------
    // ◆Todoの順序を localStorage に保存する関数
    // ------------------------------

    function saveOrder() {
        const items = listEl.querySelectorAll(".todo-item");

        const order = [...items].map((item) => item.dataset.id);

        // id順で並び替え
        todos.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

        save();
    }
}

/* =========================
    Stock → Daily 戻し用
    （Stock 側から呼ばれる）
========================= */

/**
 * Stock タスクを Daily に未達成として追加する
 * @param {string} label - タスク名
 * @param {string} storageKey - Daily 側の localStorage キー
 */
export function addToDailyTodo({ label, storageKey = "daily-todo" }) {
    const todos = JSON.parse(localStorage.getItem(storageKey)) || [];

    todos.push({
        id: `t-${Date.now()}`,
        label,
        done: false,
    });

    localStorage.setItem(storageKey, JSON.stringify(todos));
}

// ------------------------------
// ◆ today-logを保存する関数
// ------------------------------
function addTodayLog(todo) {
    const logs = loadStorage("today-log") || [];

    logs.push({
        id: `log-${Date.now()}`,
        label: todo.label,
        workTime: todo.workTime || 0,
        completedAt: todo.completedAt,
    });

    saveStorage("today-log", logs);
}