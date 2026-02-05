// stockTodo.js
export function initStockTodo({
    listEl,
    storageKey = 'stock-todo',
    emptyText = '未達成タスクはありません'
}) {
    if (!listEl) return;

    let todos = load();

    render();

    function render() {
        listEl.innerHTML = '';

        const unfinished = todos.filter(todo => !todo.done);

        if (unfinished.length === 0) {
            const li = document.createElement('li');
            li.className = 'stock-empty';
            li.textContent = emptyText;
            listEl.appendChild(li);
            return;
        }

        unfinished.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'stock-item';
            li.dataset.id = todo.id;

            li.innerHTML = `
        <label class="stock-label">
          <input type="checkbox">
          <span>${todo.label}</span>
        </label>
      `;

            li.querySelector('input').addEventListener('change', () => {
                markDone(todo.id);
            });

            listEl.appendChild(li);
        });
    }

    function markDone(id) {
        todos = todos.map(todo =>
            todo.id === id ? { ...todo, done: true } : todo
        );
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
