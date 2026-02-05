import '../styles/style.scss';
import { initSoChecklist } from './ui/sotaList.js';
import { initSotaIllustPanel, startTyping } from './ui/sotaIllustPanel.js';

/* DOM構築が終わったら初期化 */
window.addEventListener('DOMContentLoaded', () => {
    initSoChecklist();
    initSotaIllustPanel();
});

/* 画像・フォント含めて全部読み終わったら表示 */
window.addEventListener('load', () => {
    document.querySelector('.sota-page')?.classList.add('is-ready');

    // ★ ここでタイピング開始
    startTyping();
});