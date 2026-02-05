// dailyTodo.js
const STOCK_KEY = 'stock-todo';
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

    clearBtn?.addEventListener('click', () => {
        todos = [];
        save();
        render();
    });

    function render({ onlyUnfinished = false } = {}) {
        listEl.innerHTML = '';

        const renderTodos = onlyUnfinished
            ? getUnfinishedTodos()
            : todos;

        renderTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item';

            li.innerHTML = `
        <label class="todo-label">
        <input type="checkbox" ${todo.done ? 'checked' : ''}>
        <span>${todo.label}</span>
        </label>
    `;

            li.querySelector('input').addEventListener('change', e => {
                todo.done = e.target.checked;
                save();
            });

            listEl.appendChild(li);
        });
    }
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

        // daily 側から未達成を削除（＝完了済みだけ残す）
        todos = todos.filter(todo => todo.done);

        save();
        render();
    });

}

