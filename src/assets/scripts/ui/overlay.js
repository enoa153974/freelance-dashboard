import { qs, addClass, removeClass } from "../utils/dom.js";

// ==================================================
// ■ overlayでモーダルを表示する関数
// ==================================================

export function initOverlay({
    //汎用の関数を定義
    trigger,
    overlay,
    close,
    onOpen = null,
    onClose = null
}) {

    const triggerEl = qs(trigger);
    const overlayEl = qs(overlay);
    const closeEl = qs(close);

    if (!triggerEl || !overlayEl || !closeEl) return;

    triggerEl.addEventListener('click', async () => {
        addClass(overlayEl, 'active');
        document.body.style.overflow = 'hidden';
        if (onOpen) await onOpen();
    });

    function closeOverlay() {
        removeClass(overlayEl,'active');
        document.body.style.overflow = '';
        if (onClose) onClose();
    }

    closeEl.addEventListener('click', closeOverlay);

    overlayEl.addEventListener('click', e => {
        if (e.target === overlayEl) closeOverlay();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeOverlay();
    });
}