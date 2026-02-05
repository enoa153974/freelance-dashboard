export function enableTouchSort(listEl, saveOrder, state, itemSelector = '.task') {
    let draggingEl = null;
    let pressTimer = null;
    let activePointerId = null;

    listEl.querySelectorAll(itemSelector).forEach(item => {

        item.addEventListener('contextmenu', e => {
            e.preventDefault();
        });
        item.addEventListener('pointerdown', e => {

            // マウスは左クリックのみ
            if (e.pointerType === 'mouse' && e.button !== 0) return;

            e.preventDefault(); 

            activePointerId = e.pointerId;

            pressTimer = setTimeout(() => {
                draggingEl = item;
                state.isReordering = true;
                item.classList.add('is-dragging');
                item.setPointerCapture(activePointerId);
            }, 400);
        });

        item.addEventListener('pointermove', e => {
            if (!draggingEl || e.pointerId !== activePointerId) return;

            const target = document
                .elementFromPoint(e.clientX, e.clientY)
                ?.closest(itemSelector);

            if (target && target !== draggingEl) {
                const rect = target.getBoundingClientRect();
                const after = e.clientY > rect.top + rect.height / 2;
                listEl.insertBefore(
                    draggingEl,
                    after ? target.nextSibling : target
                );
            }

            e.preventDefault();
        });

        const finishDrag = () => {
            clearTimeout(pressTimer);

            if (draggingEl) {
                draggingEl.classList.remove('is-dragging');
                try {
                    draggingEl.releasePointerCapture(activePointerId);
                } catch (_) { }

                draggingEl = null;
                state.isReordering = false;
                activePointerId = null;
                saveOrder();
            }
        };

        item.addEventListener('pointerup', finishDrag);
        item.addEventListener('pointercancel', finishDrag);
        item.addEventListener('pointerleave', finishDrag);
    });
}