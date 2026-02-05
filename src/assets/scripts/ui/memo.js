/**
 * memo.js
 *
 * 家族への一言メモ
 * localStorage を使って保存・表示する
 */

export function initMemo() {
    const formEl = document.getElementById('memo-form');
    const inputEl = document.getElementById('memo-input');
    const displayEl = document.getElementById('memo-display');
    const clearBtn = document.getElementById('memo-clear');

    if (!formEl || !inputEl || !displayEl) return;

    const STORAGE_KEY = 'house-memo';

    // 保存されているメモを表示
    const savedMemo = localStorage.getItem(STORAGE_KEY);
    if (savedMemo) {
        displayEl.textContent = savedMemo;
    }

    // 保存処理
    formEl.addEventListener('submit', (e) => {
        e.preventDefault();

        const text = inputEl.value.trim();
        if (!text) return;

        localStorage.setItem(STORAGE_KEY, text);
        displayEl.textContent = text;
        inputEl.value = '';
    });

    // クリア処理
    clearBtn?.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        displayEl.textContent = '（未設定）';
        inputEl.value = '';
    });
}
