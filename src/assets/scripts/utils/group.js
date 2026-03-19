// ------------------------------
// ◆ logsのデータをグループ化する関数
// ------------------------------

export function groupByDate(logs) {
    return logs.reduce((acc, log) => {
        const date = log.completedAt;

        if (!acc[date]) {
            acc[date] = [];
        }

        acc[date].push(log);

        return acc;
    }, {});
}