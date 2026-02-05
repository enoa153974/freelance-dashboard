/* UIの制御のためのjs */

let currentPanel = "monthlyPanel";//デフォルトの状態
// ===============================
// 空車・実車・支払パネルのボタンの取得
// ===============================

//支払いパネルの必要ボタン取得
const expenseBtn = document.getElementById("expenseBtn");
const incomeBtn = document.getElementById("incomeBtn");


// ===============================
// 空車・実車・支払パネルの関数定義
// ===============================


/* 全て閉じる関数 */
export function backToHome() {
    document.getElementById("logForm")?.classList.add("hidden");
    document.getElementById("expenseForm")?.classList.add("hidden");
    document.getElementById("incomeForm")?.classList.add("hidden");
}

// ===============================
// メーターパネルの表示切替関数
// ===============================

/* 各パネルを表示切替 */
function switchMeterView(showId) {
    const ids = ["monthlyPanel", "logForm", "incomeForm", "expenseForm"];

    ids.forEach(id => {
        document.getElementById(id)?.classList.toggle("hidden", id !== showId);
    });

    currentPanel = showId; // "monthlyPanel" や "logForm" など
}


// ログボタンを押下したときの挙動
logBtn.addEventListener("click", () => {
    navigator.vibrate?.(50);
    if (currentPanel === "logForm") {
        switchMeterView("monthlyPanel");
    } else {
        switchMeterView("logForm");
    }
});

// 収入ボタンを押下したときの挙動
incomeBtn.addEventListener("click", async () => {
    navigator.vibrate?.(50);
    if (currentPanel === "incomeForm") {
        switchMeterView("monthlyPanel");
    } else {
        switchMeterView("incomeForm");
        await showincomeForm();
    }
});

// 支出ボタンを押下したときの挙動
expenseBtn.addEventListener("click", () => {
    navigator.vibrate?.(50);
    if (currentPanel === "expenseForm") {
        switchMeterView("monthlyPanel");
    } else {
        switchMeterView("expenseForm");
    }
});


// 戻す場所が必要なら
function backToMeterTime() {
    switchMeterView("monthlyPanel");
}


/* 実車ボタン押下後に表示される詳細ボタンを押すと、売上集計ページに移管する処理 */
document.getElementById("btnDetails")?.addEventListener("click", () => {
    location.href = "./sales-details.html";
});


/* =========================
    コントロールパネルの動作
========================= */
/* 帰宅ボタン */
document.getElementById('btnGoHome')?.addEventListener('click', () => {
    navigator.vibrate?.(50);

    const msg = encodeURIComponent('今から帰ります🚕');
    location.href = `https://line.me/R/msg/text/?${msg}`;
});

/* GPTボタン */
document.getElementById('btnChatGPT')?.addEventListener('click', () => {
    navigator.vibrate?.(50);
    location.href = 'https://chatgpt.com/';
});


/* マップボタン */
document.getElementById('btnMap')?.addEventListener('click', () => {
    navigator.vibrate?.(50);
    location.href = 'https://www.google.com/maps';
});

const translateBtn = document.getElementById('btnTranslate');

let pressTimer = null;
let isLongPress = false;
const LONG_PRESS_TIME = 600; // ms

function startPressTimer(longPressAction) {
    isLongPress = false;
    pressTimer = setTimeout(() => {
        isLongPress = true;
        navigator.vibrate?.(80);
        longPressAction();
    }, LONG_PRESS_TIME);
}

function clearPressTimer() {
    if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
    }
}

/* ===== 長押し開始 ===== */
translateBtn?.addEventListener('touchstart', () => {
    startPressTimer(() => {
        location.href = 'https://translate.google.com/?sl=ja&tl=zh-CN';
    });
});

translateBtn?.addEventListener('mousedown', () => {
    startPressTimer(() => {
        location.href = 'https://translate.google.com/?sl=ja&tl=zh-CN';
    });
});

/* ===== 押すのをやめた ===== */
translateBtn?.addEventListener('touchend', () => {
    clearPressTimer();

    // 短タップ判定
    if (!isLongPress) {
        navigator.vibrate?.(50);
        location.href = 'https://translate.google.com/?sl=ja&tl=en';
    }

    isLongPress = false;
});

translateBtn?.addEventListener('mouseup', () => {
    clearPressTimer();

    if (!isLongPress) {
        navigator.vibrate?.(50);
        location.href = 'https://translate.google.com/?sl=ja&tl=en';
    }

    isLongPress = false;
});

translateBtn?.addEventListener('touchcancel', clearPressTimer);
translateBtn?.addEventListener('mouseleave', clearPressTimer);

