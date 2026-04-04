// ------------------------------
// ◆ コピーボタン
// ------------------------------

export function initCopyButtons() {

    const buttons = document.querySelectorAll(".copy-btn");

    buttons.forEach(btn => {

        btn.addEventListener("click", () => {

            const text = btn.dataset.copy;

            if (!text) return;

            navigator.clipboard.writeText(text);

            btn.textContent = "Copied!";

            setTimeout(() => {
                btn.textContent = "Copy";
            }, 1200);

        });

    });

}