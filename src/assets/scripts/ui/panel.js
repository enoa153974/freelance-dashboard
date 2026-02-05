/* メインパネルのデータ管理や集計のためのjs */

'use strict';

import { db } from "../firebase.js";
import { collection, addDoc, getDocs } from "firebase/firestore";
import {  } from "./switchPanel.js";

console.log("DB>>>", db);
console.log("🔥 panel.js loaded!");

let currentType = "支出";
const formatYen = amount => `¥${amount.toLocaleString()}`;

// 今月の開始日と終了日を返す関数
function getMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1); // 月初
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59); // 月末
    return { start, end };
}

/* 今月の支出と収入の割合が一定以上になったらコメントをだす */
/* 「今月少しつかいすぎなので注意！」とか */


// ===============================
// デフォルトパネルに売上集計を表示
// ===============================

async function showMonthlySummary() {
    try {
        const { totalExpense, totalIncome } = await loadMonthlyTotal();

        document.getElementById("summaryExpense").textContent = `支出：${totalExpense.toLocaleString()}円`;
        document.getElementById("summaryIncome").textContent = `収入：${totalIncome.toLocaleString()}円`;
        incomeEl.textContent = `合計：${(totalIncome - totalExpense).toLocaleString()}円`;
    } catch (e) {
        incomeEl.textContent = "読み込みに失敗しました🥲";
        console.error(e);
    }
}

// 🔄 関数を実行
showMonthlySummary();

// ======= 空車ログ 保存処理 =======
const saveLogBtn = document.getElementById("saveLogBtn");
const logInput = document.getElementById("logInput");

if (saveLogBtn) {
    saveLogBtn.addEventListener("click", async () => {
        const note = logInput.value.trim();

        if (!note) {
            alert("メモを入力してね！");
            return;
        }

        try {
            await addDoc(collection(db, "driverLogs"), {
                note: note,
                createdAt: new Date()
            });

            alert("🚕 ログ書き込みました！");
            logInput.value = ""; // 入力リセット
            backToHome();
            backToMeterTime();

        } catch (e) {
            console.error("💥 driverLogs 保存失敗:", e);
            alert("保存に失敗したかも…😢");
        }
    });
}

/* =========================
    家計簿データ表示（集計データの表示＆移管）
========================= */
async function loadMonthlyTotal() {
    const { start, end } = getMonthRange();

    let totalExpense = 0;
    let totalIncome = 0;

    const snapshot = await getDocs(collection(db, "transactions"));

    snapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt.toDate();

        if (createdAt >= start && createdAt <= end) {
            if (data.type === "支出") {
                totalExpense += Number(data.amount) || 0;
            }
            if (data.type === "収入") {
                totalIncome += Number(data.amount) || 0;
            }
        }
    });

    return {
        totalExpense,
        totalIncome,
    };
}




// ===============================
// 収入フォーム表示/保存処理
// ===============================

// ⭐ 保存ボタン押したら Firestore に追加

const saveIncomeBtn = document.getElementById("saveIncome");
saveIncomeBtn.addEventListener("click", async () => {
    currentType = "収入";
    const dateInput = document.getElementById("incomeDate").value;
    const category = document.getElementById("incomeCategory").value;
    const amount = Number(document.getElementById("incomeAmount").value);
    const memo = document.getElementById("incomeMemo").value;
    const msg = document.getElementById("incomeMsg");

    if (!dateInput || !category || !amount) {
        msg.textContent = "※ 必須項目を入力してね！";
        return;
    }

    const month = dateInput.slice(0, 7); // "YYYY-MM"

    try {
        await addDoc(collection(db, "transactions"), {
            date: dateInput,
            month,
            type: currentType,   // 👈 ここが収入 or 支出
            category,
            amount,
            memo,
            createdAt: new Date()
        });

        msg.textContent = `✨ ${currentType}を記録したよ！`;

        document.getElementById("expenseAmount").value = "";
        document.getElementById("expenseMemo").value = "";


    } catch (err) {
        msg.textContent = "💥 保存に失敗したかも…";
        console.error(err);
    }
});


// ===============================
// 支出フォーム表示/保存処理
// ===============================

// ⭐ 保存ボタン押したら Firestore に追加
const saveBtn = document.getElementById("saveKakeibo");

saveBtn.addEventListener("click", async () => {
    currentType = "支出";
    const dateInput = document.getElementById("kakeiboDate").value;
    const category = document.getElementById("kakeiboCategory").value;
    const amount = Number(document.getElementById("expenseAmount").value);
    const memo = document.getElementById("expenseMemo").value;
    const msg = document.getElementById("kakeiboMsg");

    if (!dateInput || !category || !amount) {
        msg.textContent = "※ 必須項目を入力してね！";
        return;
    }

    const month = dateInput.slice(0, 7); // "YYYY-MM"

    try {
        await addDoc(collection(db, "transactions"), {
            date: dateInput,
            month,
            type: currentType,   // 👈 ここが収入 or 支出
            category,
            amount,
            memo,
            createdAt: new Date()
        });

        msg.textContent = `✨ ${currentType}を記録したよ！`;

        document.getElementById("expenseAmount").value = "";
        document.getElementById("expenseMemo").value = "";


    } catch (err) {
        msg.textContent = "💥 保存に失敗したかも…";
        console.error(err);
    }
});
