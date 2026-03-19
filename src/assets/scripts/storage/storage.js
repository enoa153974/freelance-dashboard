
// ==================================================
// ■ storageへの読み書き処理
// ==================================================

//localStorageに保存する関数
export function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

//localStorageに保存されたものを読み込む関数
export function load(key) {
    return JSON.parse(localStorage.getItem(key)) || null;
}

//localStorageから削除する関数
export function remove(key) {
    localStorage.removeItem(key);
}
