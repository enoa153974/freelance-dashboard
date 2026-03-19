# 🧠 Freelance Work Dashboard

フリーランス業務を効率的に管理するためのPWAベース業務管理アプリ。

---

## 📌 現在の実装状況

---

## ✅ 1. デイリーTodo管理

### 機能

* タスク追加
* 完了チェック
* 未達成タスクをStockへ移動
* StockからDailyへ戻す
* localStorage保存
* リロード不要の即時反映（カスタムイベント使用）

### データ構造

```js
{
  id: 't-123456',
  label: 'LPコーディング',
  done: true,
  completedAt: '2026-02-06',
  workTime: 5400 // 秒
}
```

---

## ✅ 2. 未達成タスク（Stock）

### 機能

* 未達成タスクを保持
* 完了チェック可能
* 完了済み一括削除（confirm付き）
* Dailyとの双方向移動
* `todo:updated` カスタムイベントで同期

---

## ✅ 3. 作業タイマー

### 機能

* ▶ 開始
* ⏸ 停止
* ⏹ リセット
* リロード耐性あり
* 秒単位で正確に計測
* 常時カウント表示（h m s形式）

### 保存データ構造

```js
{
  startAt: 1707350000000,
  elapsed: 120,
  running: true
}
```

---

## ✅ 4. タスクと作業時間の紐づけ

タスク完了時に：

* 現在のタイマー秒数を取得
* `workTime` に保存
* `completedAt` に日付保存
* タイマーを自動リセット

```js
todo.workTime = getCurrentTimerSeconds();
todo.completedAt = getToday();
resetTimer();
```

---

## ✅ 5. 今日の完了ログ表示

### 表示内容

* 今日完了したタスク一覧
* 各タスクの作業時間
* 今日の合計作業時間

### 合計時間算出

```js
const totalSeconds = todayDone.reduce(
  (sum, t) => sum + (t.workTime || 0),
  0
);
```

---

## ✅ 6. 時間表示仕様

内部データは秒で保持。

表示形式は `●h ●m ●s`。

例：

```
0h 3m 12s
1h 15m 4s
```

### フォーマット関数

```js
export function formatSecondsHMS(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h}h ${m}m ${s}s`;
}
```

---

## 🧩 設計方針

### イベント駆動設計

* `todo:updated` カスタムイベントを使用
* 各モジュールを疎結合で構築
* 即時UI反映
* リロード不要

### ユーティリティ分離

```
utils/
 ├─ date.js
 └─ time.js
```

* DOM依存ロジックと純粋関数を分離
* 将来のFirebase移行に対応しやすい設計

---

## 🚀 今後の拡張予定

* 案件（タグ）別時間集計
* 今日 / 今週 / 今月 切替表示
* 作業時間 × 単価 = 金額算出
* Firebase導入
* 作業ログ履歴ページ
* ダッシュボード可視化

---

## 🎯 現在の到達地点

* タスク管理 ✔
* 作業時間計測 ✔
* 完了ログ ✔
* 合計時間算出 ✔
* 即時同期 ✔

実運用可能レベルの業務管理アプリ基盤が完成。

src
├── assets
│   ├── data
│   │   └── recipes.json
│   ├── scripts
│   │   ├── common
│   │   │   ├── extraTaskManager.js
│   │   │   └── touchSort.js
│   │   ├── firebase.js
│   │   ├── hint.js
│   │   ├── main.js
│   │   ├── modules
│   │   │   ├── flowsViewer.js
│   │   │   └── rulesViewer.js
│   │   ├── services
│   │   │   └── logs.js
│   │   ├── storage
│   │   │   └── storage.js
│   │   ├── ui
│   │   │   ├── clock.js
│   │   │   ├── dailyTodo.js
│   │   │   ├── extraTasks.js
│   │   │   ├── housework.js
│   │   │   ├── nav.js
│   │   │   ├── overlay.js
│   │   │   ├── saveWizard.js
│   │   │   ├── sotaIllustPanel.js
│   │   │   ├── stampPanel.js
│   │   │   ├── stockTodo.js
│   │   │   ├── todayLog.js
│   │   │   └── weather.js
│   │   ├── utils
│   │   │   ├── button.js
│   │   │   ├── date.js
│   │   │   ├── dom.js
│   │   │   ├── group.js
│   │   │   └── time.js
│   │   └── work-log.js
│   └── styles
│       ├── base
│       │   ├── _global.scss
│       │   └── _reset.scss
│       ├── components
│       │   ├── common
│       │   │   ├── _footer.scss
│       │   │   ├── _header.scss
│       │   │   └── _top-header.scss
│       │   ├── sections
│       │   │   ├── _hint-page.scss
│       │   │   ├── _main-panel.scss
│       │   │   ├── _tool-panel.scss
│       │   │   └── _work-log.scss
│       │   └── ui
│       │       ├── _breadcrumb.scss
│       │       ├── _card.scss
│       │       ├── _gallery-slider.scss
│       │       ├── _overlay.scss
│       │       ├── _save-wizard.scss
│       │       └── _stamp-panel.scss
│       ├── foundation
│       │   ├── _function.scss
│       │   ├── _mixin.scss
│       │   ├── _variables-custom.scss
│       │   ├── _variables.scss
│       │   └── import.scss
│       ├── layout
│       │   └── _module.scss
│       ├── style.scss
│       └── utility
│           ├── _button-overrides.scss
│           ├── _button.scss
│           ├── _color.scss
│           ├── _decoration.scss
│           ├── _font.scss
│           ├── _link-cover.scss
│           ├── _margin.scss
│           ├── _padding.scss
│           └── _utilities.scss
└── partials
    ├── footer.hbs
    ├── header.hbs
    ├── mainpanel.hbs
    ├── toolpanel.hbs
    └── ui
        └── card.hbs