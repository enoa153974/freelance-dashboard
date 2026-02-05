// dailyTodo.js

export function initDailyTodo({
    listEl,
    formEl,
    inputEl,
    moveBtn,
    clearBtn,
    storageKey = 'daily-todo',
    stockKey = 'stock-todo'
}) {
    if (!listEl || !formEl || !inputEl) return;

    let todos = load();
    render();

    /* =========================
       イベント
    ========================= */

    // 追加
    formEl.addEventListener('submit', e => {
        e.preventDefault();
        const text = inputEl.value.trim();
        if (!text) return;

        todos.push({
            id: `t-${Date.now()}`,
            label: text,
            done: false
        });

        save();
        render();
        inputEl.value = '';
    });

    // 全リセット
    clearBtn?.addEventListener('click', () => {
        todos = [];
        save();
        render();
    });

    // 未達成を Stock に移動
    moveBtn?.addEventListener('click', () => {
        const unfinished = getUnfinishedTodos();
        if (unfinished.length === 0) return;

        const stockTodos = loadStock();

        unfinished.forEach(todo => {
            stockTodos.push({
                id: `s-${Date.now()}-${todo.id}`,
                label: todo.label,
                done: false
            });
        });

        saveStock(stockTodos);

        // daily 側は「完了済みだけ残す」
        todos = todos.filter(todo => todo.done);

        save();
        render();
    });

    /* =========================
       描画
    ========================= */

    function render() {
        listEl.innerHTML = '';

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            if (todo.done) li.classList.add('is-done');

            li.innerHTML = `
                <label class="todo-label">
                    <input type="checkbox" ${todo.done ? 'checked' : ''}>
                    <span>${todo.label}</span>
                </label>
            `;

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

    function getUnfinishedTodos() {
        return todos.filter(todo => !todo.done);
    }

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
========================= */

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
