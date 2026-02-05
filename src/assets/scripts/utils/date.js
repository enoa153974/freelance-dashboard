// utils/date.js
// 日付・時間に関するユーティリティ

export function getToday() {
    return new Date().toISOString().split('T')[0];
}
