import { db } from '../firebase';
import { collection, getDocs, query, where } from "firebase/firestore";

async function loadMonthlyData(targetMonth = "2025-02") {
    const tableBody = document.getElementById("monthlyTableBody");
    const totalCell = document.getElementById("monthlyTotal");

    tableBody.innerHTML = "読み込み中...";
    let total = 0;
    let rowsStr = "";

    const q = query(
        collection(db, "transactions"),
        where("month", "==", targetMonth)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
        const data = doc.data();
        total += data.amount;

        rowsStr += `
    <tr>
        <td>${data.date}</td>
        <td>${data.type}</td>
        <td>${data.category}</td>
        <td>${data.amount}</td>
        <td>${data.memo ?? ""}</td>
    </tr>
    `;
    });

    tableBody.innerHTML = rowsStr || `<tr><td colspan="5">データなし</td></tr>`;
    totalCell.textContent = total.toLocaleString();
}
