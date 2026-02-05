// stockTodo.js
import { addToDailyTodo } from './dailyTodo.js';

export function initStockTodo({
    listEl,
    clearDoneBtn,
    storageKey = 'stock-todo',
    dailyKey = 'daily-todo',
    emptyText = '未達成タスクはありません'
}) {
    if (!listEl) return;

    let todos = load();
    render();

    clearDoneBtn?.addEventListener('click', () => {
        const hasDone = todos.some(todo => todo.done);
        if (!hasDone) return;

        todos = todos.filter(todo => !todo.done);
        save();
        render();

        clearDoneBtn.disabled = !todos.some(todo => todo.done);
    });


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
            li.className = 'stock-item';
            if (todo.done) li.classList.add('is-done');
            li.dataset.id = todo.id;

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

            // 今日に戻す
            li.querySelector('.stock-back').addEventListener('click', () => {
                addToDailyTodo({
                    label: todo.label,
                    storageKey: dailyKey
                });
                removeFromStock(todo.id);
            });

            // 完了（チェックしても消えない）
            li.querySelector('.stock-done').addEventListener('change', e => {
                todo.done = e.target.checked;
                save();
                render();
            });

            listEl.appendChild(li);
        });
    }

    function removeFromStock(id) {
        todos = todos.filter(todo => todo.id !== id);
        save();
        render();
    }

    function save() {
        localStorage.setItem(storageKey, JSON.stringify(todos));
    }

    function load() {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    }
}
