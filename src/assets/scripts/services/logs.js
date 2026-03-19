import { db } from "../firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc
} from "firebase/firestore";

const COLLECTION = "logs";

/**
 * ログ追加
 */
export async function addLog(log) {
    try {
        const docRef = await addDoc(collection(db, COLLECTION), {
            taskName: log.taskName,
            time: log.time,
            completedAt: log.completedAt,
            createdAt: new Date().toISOString() // ← 安定版
        });

        return docRef.id;
    } catch (e) {
        console.error("ログ保存エラー", e);
        throw e;
    }
}

/**
 * ログ一覧取得（新しい順）
 */
export async function fetchLogs() {
    try {
        const q = query(
            collection(db, COLLECTION),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(docSnap => {
            const data = docSnap.data();

            return {
                id: docSnap.id,
                taskName: data.taskName,
                time: data.time,
                completedAt: data.completedAt,
                createdAt: data.createdAt
            };
        });

    } catch (e) {
        console.error("ログ取得エラー", e);
        return [];
    }
}

/**
 * ログ削除
 */
export async function deleteLog(id) {
    try {
        await deleteDoc(doc(db, COLLECTION, id));
    } catch (e) {
        console.error("ログ削除エラー", e);
        throw e;
    }
}