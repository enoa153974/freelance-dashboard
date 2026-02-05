// dailyTodo.js
// 「本日のやること（Daily Todo）」を管理するモジュール
// 追加・完了管理・未達成を Stock に送る役割を持つ

// Daily / Stock 間の更新同期に使うカスタムイベント名
const TODO_UPDATE_EVENT = 'todo:updated';

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
    storageKey = 'daily-todo',
    stockKey = 'stock-todo'
}) {
    // 必須要素がなければ何もしない（安全ガード）
    if (!listEl || !formEl || !inputEl) return;

    // localStorage から Daily タスクを読み込み
    let todos = load();

    // 初期描画
    render();

    /* =========================
       他画面（Stock）からの更新通知
       localStorage は更新されても、
       JS 内の todos は自動で変わらないため
       カスタムイベントで再読み込みする
    ========================= */
    window.addEventListener(TODO_UPDATE_EVENT, () => {
        todos = load();
        render();
    });

    /* =========================
       イベント
    ========================= */

    /* --- タスク追加 --- */
    formEl.addEventListener('submit', e => {
        e.preventDefault();

        const text = inputEl.value.trim();
        if (!text) return;

        // 新しいタスクを追加（未達成）
        todos.push({
            id: `t-${Date.now()}`,
            label: text,
            done: false
        });

        save();
        render();

        // 入力欄をクリア
        inputEl.value = '';
    });

    /* --- Daily 全リセット --- */
    clearBtn?.addEventListener('click', () => {
        todos = [];
        save();
        render();
    });

    /* --- 未達成タスクを Stock に移動 --- */
    moveBtn?.addEventListener('click', () => {
        // 未達成タスクだけ抽出
        const unfinished = getUnfinishedTodos();
        if (unfinished.length === 0) return;

        // Stock 側のタスクを読み込み
        const stockTodos = loadStock();

        // 未達成タスクを Stock 用データとして追加
        unfinished.forEach(todo => {
            stockTodos.push({
                id: `s-${Date.now()}-${todo.id}`,
                label: todo.label,
                done: false
            });
        });

        // Stock 側を保存
        saveStock(stockTodos);

        // Daily 側には「完了済みだけ残す」
        todos = todos.filter(todo => todo.done);

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
        listEl.innerHTML = '';

        // タスクを1件ずつ描画
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item';

            // 完了済みなら見た目用クラスを付与
            if (todo.done) li.classList.add('is-done');

            li.innerHTML = `
                <label class="todo-label">
                    <input type="checkbox" ${todo.done ? 'checked' : ''}>
                    <span>${todo.label}</span>
                </label>
            `;

            // 完了チェック（チェックしても消えない）
            li.querySelector('input').addEventListener('change', e => {
                todo.done = e.target.checked;
                save();
                render();
            });

            listEl.appendChild(li);
        });
    }

    /* =========================
       ロジック
    ========================= */

    // 未達成タスクのみ抽出
    function getUnfinishedTodos() {
        return todos.filter(todo => !todo.done);
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

    function loadStock() {
        return JSON.parse(localStorage.getItem(stockKey)) || [];
    }

    function saveStock(stockTodos) {
        localStorage.setItem(stockKey, JSON.stringify(stockTodos));
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
export function addToDailyTodo({
    label,
    storageKey = 'daily-todo'
}) {
    const todos = JSON.parse(localStorage.getItem(storageKey)) || [];

    todos.push({
        id: `t-${Date.now()}`,
        label,
        done: false
    });

    localStorage.setItem(storageKey, JSON.stringify(todos));
}
