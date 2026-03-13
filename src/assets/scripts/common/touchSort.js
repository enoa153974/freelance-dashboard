/**
 * ==========================================================
 * enableTouchSort
 * ----------------------------------------------------------
 * タッチ・マウス両対応の「長押しドラッグ並び替え」機能
 *
 * ■特徴
 * ・400ms長押しでドラッグ開始
 * ・スマホ / PC 両対応（pointerイベント）
 * ・並び替え完了時に saveOrder() を実行
 *
 * ■使用例
 * ----------------------------------------------------------
 * import { enableTouchSort } from "./touch-sort.js";
 *
 * const list = document.querySelector("#todoList");
 *
 * enableTouchSort(
 *     list,
 *     saveTodoOrder,  // 並び替え後に保存する関数
 *     state           // 状態管理オブジェクト
 * );
 *
 * ==========================================================
 */

export function enableTouchSort(
    listEl,                 // 並び替え対象のリスト要素
    saveOrder,              // 並び順保存関数
    state,                  // 状態管理オブジェクト
    itemSelector = '.task'  // 並び替え対象の子要素
) {

    let draggingEl = null;     // 現在ドラッグ中の要素
    let pressTimer = null;     // 長押し判定タイマー
    let activePointerId = null;// 操作中のポインターID

    // ------------------------------------------------------
    // 各タスクにイベントを登録
    // ------------------------------------------------------
    listEl.querySelectorAll(itemSelector).forEach(item => {

        // --------------------------------------------------
        // 右クリックメニューを無効化（誤操作防止）
        // --------------------------------------------------
        item.addEventListener('contextmenu', e => {
            e.preventDefault();
        });

        // --------------------------------------------------
        // pointerdown
        // 押した瞬間（長押し判定開始）
        // --------------------------------------------------
        item.addEventListener('pointerdown', e => {

            // マウスの場合は左クリックのみ許可
            if (e.pointerType === 'mouse' && e.button !== 0) return;

            e.preventDefault();

            activePointerId = e.pointerId;

            // ----------------------------------------------
            // 長押し判定（400ms）
            // ----------------------------------------------
            pressTimer = setTimeout(() => {

                draggingEl = item;
                state.isReordering = true;

                // ドラッグ中スタイル
                item.classList.add('is-dragging');

                // pointerキャプチャ
                item.setPointerCapture(activePointerId);

            }, 400);
        });

        // --------------------------------------------------
        // pointermove
        // ドラッグ中の移動処理
        // --------------------------------------------------
        item.addEventListener('pointermove', e => {

            if (!draggingEl || e.pointerId !== activePointerId) return;

            // 現在のポインタ位置の要素取得
            const target = document
                .elementFromPoint(e.clientX, e.clientY)
                ?.closest(itemSelector);

            if (target && target !== draggingEl) {

                const rect = target.getBoundingClientRect();

                // 要素の中央より下なら「後ろ」
                const after = e.clientY > rect.top + rect.height / 2;

                listEl.insertBefore(
                    draggingEl,
                    after ? target.nextSibling : target
                );
            }

            e.preventDefault();
        });

        // --------------------------------------------------
        // ドラッグ終了処理
        // --------------------------------------------------
        const finishDrag = () => {

            clearTimeout(pressTimer);

            if (draggingEl) {

                draggingEl.classList.remove('is-dragging');

                try {
                    draggingEl.releasePointerCapture(activePointerId);
                } catch (_) {}

                draggingEl = null;
                state.isReordering = false;
                activePointerId = null;

                // 並び順保存
                saveOrder();
            }
        };

        item.addEventListener('pointerup', finishDrag);
        item.addEventListener('pointercancel', finishDrag);
        item.addEventListener('pointerleave', finishDrag);
    });
}