import { enableTouchSort } from './touchSort.js';

export function initExtraTaskManager({
    listEl,
    formEl,
    inputEl,
    resetBtn,
    storageKeyPrefix,
    itemSelector = '.task',
    showHanamaru = false
}) {
    const TASKS_KEY = `${storageKeyPrefix}-tasks`;
    const ORDER_KEY = `${storageKeyPrefix}-order`;
    const DATE_KEY = `${storageKeyPrefix}-date`;

    const reorderState = { isReordering: false };
    let tasks = loadTasks();

    resetIfNewDay();
    render();

    formEl?.addEventListener('submit', e => {
        e.preventDefault();
        const text = inputEl.value.trim();
        if (!text) return;

        tasks.push({
            id: `${storageKeyPrefix}-${Date.now()}`,
            label: text,
            done: false
        });

        saveTasks();
        render();
        inputEl.value = '';
    });

    resetBtn?.addEventListener('click', () => {
        tasks = [];
        saveTasks();
        localStorage.removeItem(ORDER_KEY);
        render();
    });

    function render() {
        listEl.innerHTML = '';

        const order = JSON.parse(localStorage.getItem(ORDER_KEY));
        let renderList = [...tasks];

        if (order) {
            renderList.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
        }

        renderList.forEach(task => {
            const li = document.createElement('li');
            li.className = itemSelector.replace('.', '');
            li.dataset.taskId = task.id;
            if (task.done) li.classList.add('is-done');

            li.innerHTML = `
  <span class="task__label">${task.label}</span>
  ${showHanamaru
                    ? `
        <span class="task__result hanamaru">
          <img src="/svg/flower-3.svg" alt="はなまる" draggable="false">
        </span>
      `
                    : ''
                }
`;

            li.addEventListener('click', () => {
                if (reorderState.isReordering) return;
                task.done = !task.done;
                saveTasks();
                render();
            });

            listEl.appendChild(li);
        });

        enableTouchSort(listEl, saveOrder, reorderState, itemSelector);
    }

    function saveTasks() {
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }

    function saveOrder() {
        const order = [...listEl.children].map(li => li.dataset.taskId);
        localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    }

    function loadTasks() {
        return JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
    }

    function resetIfNewDay() {
        const today = new Date().toDateString();
        const saved = localStorage.getItem(DATE_KEY);
        if (saved !== today) {
            localStorage.removeItem(TASKS_KEY);
            localStorage.removeItem(ORDER_KEY);
            localStorage.setItem(DATE_KEY, today);
        }
    }
}