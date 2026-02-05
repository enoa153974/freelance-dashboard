/**
 * soChecklist.js
 *
 * ・そーくん 出勤前チェックリスト
 * ・2列（貴重品 / ツール）
 * ・チェック形式
 * ・日付が変わったら全リセット
 */

export function initSoChecklist() {

    /* =========================
        DOM取得
    ========================= */
    const valuablesEl = document.getElementById('so-checklist--valuables');
    const toolsEl = document.getElementById('so-checklist--tools');

    if (!valuablesEl || !toolsEl) return;

    /* =========================
        チェック項目
    ========================= */
    const VALUABLES = [
        { id: 'wallet', label: '財布' },
        { id: 'name_tag', label: '名札' },
        { id: 'armband', label: '腕章' },
        { id: 'license', label: '免許' },
        { id: 'wifi', label: 'wi-fi' },
        { id: 'key', label: '鍵' }
    ];

    const TOOLS = [
        { id: 'pen', label: 'ボールペン' },
        { id: 'zip_bag_white', label: '白チャック袋' },
        { id: 'memory_card_bag', label: 'メモリーカード袋' },
        { id: 'straw', label: 'ストロー' },
        { id: 'change_bag', label: '釣銭袋' },
        { id: 'coin_case', label: 'コインケース' },
        { id: 'board', label: 'ボード' },
        { id: 'smartphone_holder', label: 'スマホホルダー' },
        { id: 'white_gloves', label: '白手袋' },
        { id: 'eye_mask', label: 'アイマスク' }
    ];

    /* =========================
        localStorage key
    ========================= */
    const STATUS_KEY = 'so-checklist-status';
    const DATE_KEY = 'so-checklist-date';

    resetIfNewDay();

    const status = JSON.parse(localStorage.getItem(STATUS_KEY)) || {};

    /* =========================
        リスト生成
    ========================= */
    renderList(valuablesEl, VALUABLES, status);
    renderList(toolsEl, TOOLS, status);

    /* =========================
        関数群
    ========================= */
    function renderList(listEl, items, status) {
        listEl.innerHTML = '';

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'checklist__item';
            li.dataset.itemId = item.id;

            if (status[item.id]) {
                li.classList.add('is-checked');
            }

            li.innerHTML = `
                <label class="checklist__label-wrap">
                    <input
                        type="checkbox"
                        class="checklist__checkbox"
                        ${status[item.id] ? 'checked' : ''}
                    >
                    <span class="checklist__label">${item.label}</span>
                </label>
            `;

            const checkbox = li.querySelector('.checklist__checkbox');

            checkbox.addEventListener('change', () => {
                const checked = checkbox.checked;
                li.classList.toggle('is-checked', checked);
                status[item.id] = checked;
                localStorage.setItem(STATUS_KEY, JSON.stringify(status));
            });

            listEl.appendChild(li);
        });
    }

    function resetIfNewDay() {
        const todayStr = new Date().toDateString();
        if (localStorage.getItem(DATE_KEY) !== todayStr) {
            localStorage.removeItem(STATUS_KEY);
            localStorage.setItem(DATE_KEY, todayStr);
        }
    }

}