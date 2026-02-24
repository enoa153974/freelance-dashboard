// ==================================================
// Overlay Controller (Advanced)
// --------------------------------------------------
// 機能
// ・HTML差し込み表示
// ・開閉コールバック
// ・ESC閉じ
// ・背景クリック閉じ
// ・多重起動防止
//
// 使い方
// openOverlay({
//   html: "<div>内容</div>",
//   onOpen(){},
//   onClose(){}
// })
//
// ==================================================

let currentOnClose = null;
let isOpen = false;


// ==================================================
// ■ 開く
// ==================================================
export function openOverlay({ html, onOpen = null, onClose = null } = {}) {

    const overlay = document.getElementById("overlay");
    const box = document.getElementById("overlayContent");

    if (!overlay || !box) return;

    // すでに開いてたら中身だけ差し替え
    box.innerHTML = html || "";

    // callback保存
    currentOnClose = onClose;

    if (!isOpen) {
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
        isOpen = true;
    }

    if (onOpen) onOpen();
}



// ==================================================
// ■ 閉じる
// ==================================================
export function closeOverlay() {

    const overlay = document.getElementById("overlay");
    if (!overlay || !isOpen) return;

    overlay.classList.remove("active");
    document.body.style.overflow = "";
    isOpen = false;

    if (currentOnClose) currentOnClose();
    currentOnClose = null;
}



// ==================================================
// ■ 初期化（1回だけ呼ぶ）
// ==================================================
export function initOverlay() {

    const overlay = document.getElementById("overlay");
    const close = document.getElementById("closeModal");

    if (!overlay || !close) return;

    // 閉じるボタン
    close.onclick = closeOverlay;

    // 背景クリック閉じ
    overlay.onclick = e => {
        if (e.target === overlay) closeOverlay();
    };

    // ESC閉じ
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeOverlay();
    });
}