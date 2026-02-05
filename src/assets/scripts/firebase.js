/* firestoreデータベースをインポート */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//firebaseに接続するために必要な情報群
// .env から値を読み込む（Viteは import.meta.env）
const firebaseConfig = {
    apiKey: "AIzaSyCSMh42tIevZqZ7iSl6evG2X7JxmRt68KA",
    authDomain: "household-book-pwa.firebaseapp.com",
    projectId: "household-book-pwa",
    storageBucket: "household-book-pwa.firebasestorage.app",
    messagingSenderId: "896522372306",
    appId: "1:896522372306:web:f906dd2cc0853c4a3c190b"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log("🔥 Firebase initialized:", app);
console.log("📦 Firestore instance:", db);
