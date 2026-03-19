/* firestoreデータベースをインポート */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//firebaseに接続するために必要な情報群
// .env から値を読み込む（Viteは import.meta.env）
const firebaseConfig = {
    apiKey: "AIzaSyCtnVEr8zdDkY4WFq1iEQt3QfN07sWbp-A",
    authDomain: "freelance-dashboard-77ab0.firebaseapp.com",
    projectId: "freelance-dashboard-77ab0",
    storageBucket: "freelance-dashboard-77ab0.firebasestorage.app",
    messagingSenderId: "639198821772",
    appId: "1:639198821772:web:7d8b570932b86910416aa9"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log("🔥 Firebase initialized:", app);
console.log("📦 Firestore instance:", db);
