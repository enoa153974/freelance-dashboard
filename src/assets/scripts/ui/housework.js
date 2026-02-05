// housework.js
import { enableTouchSort } from '../common/touchSort.js';

// housework.js
const HOUSEWORKS = [
    { id: 'dishwashing', label: '食器洗い', icon: 'fa-solid fa-utensils' },
    { id: 'laundry', label: '洗たく', icon: 'fa-solid fa-shirt' },
    { id: 'cleaning', label: '掃除', icon: 'fa-solid fa-broom' },
    { id: 'cooking_prep', label: 'ご飯下ごしらえ', icon: 'fa-solid fa-kitchen-set' },
    { id: 'trash', label: 'ゴミ出し', icon: 'fa-solid fa-trash' },
    { id: 'tidying', label: '片付け', icon: 'fa-solid fa-box-open' }
];

const STATUS_KEY = 'asha-housework-status';
const DATE_KEY = 'asha-housework-date';
const ORDER_KEY = 'asha-housework-order';

export function initHousework() {
    const listEl = document.getElementById('housework-list');
    if (!listEl) return;

    renderList(listEl);
    restoreOrder(listEl);
    updateNumbers(listEl);
    applyStatus(listEl);
    enableReorder(listEl);
}

/* =========================
   表示
========================= */
function renderList(listEl) {
    listEl.innerHTML = '';

    HOUSEWORKS.forEach(task => {
        const li = document.createElement('li');
        li.className = 'housework-card';
        li.dataset.taskId = task.id;

        li.innerHTML = `
      <span class="housework-card__number"></span>
      <i class="housework-card__icon ${task.icon}"></i>
      <span class="housework-card__label">${task.label}</span>
    `;

        listEl.appendChild(li);
    });

    updateNumbers(listEl);
}

/* 並び替え後も数字が入れ替わる */
function updateNumbers(listEl) {
    [...listEl.children].forEach((card, index) => {
        const numEl = card.querySelector('.housework-card__number');
        numEl.textContent = index + 1;
    });
}
/* =========================
   状態管理
========================= */
function applyStatus(listEl) {
    resetIfNewDay();

    const status = JSON.parse(localStorage.getItem(STATUS_KEY)) || {};

    listEl.querySelectorAll('.housework-card').forEach(card => {
        const id = card.dataset.taskId;

        if (status[id]) card.classList.add('is-done');

        card.addEventListener('click', () => {
            card.classList.toggle('is-done');
            status[id] = card.classList.contains('is-done');
            localStorage.setItem(STATUS_KEY, JSON.stringify(status));
        });
    });
}

function resetIfNewDay() {
    const today = new Date().toDateString();
    if (localStorage.getItem(DATE_KEY) !== today) {
        localStorage.removeItem(STATUS_KEY);
        localStorage.setItem(DATE_KEY, today);
    }
}

/* =========================
   並び替え
========================= */
function enableReorder(listEl) {
    const reorderState = { isReordering: false };
    enableTouchSort(
        listEl,
        () => {
            saveOrder(listEl);
            updateNumbers(listEl);
        },
        reorderState,
        '.housework-card'
    );
}

function saveOrder(listEl) {
    const order = [...listEl.children].map(el => el.dataset.taskId);
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

function restoreOrder(listEl) {
    const saved = JSON.parse(localStorage.getItem(ORDER_KEY));
    if (!Array.isArray(saved)) return;

    saved.forEach(id => {
        const el = listEl.querySelector(`[data-task-id="${id}"]`);
        if (el) listEl.appendChild(el);
    });
}