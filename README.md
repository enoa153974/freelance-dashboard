# House Dashboard PWA

家に余っている **Android タブレットを横置きのスマートディスプレイ**として活用するための、  
**家族用ダッシュボード PWA**。

時計・天気・家族ページ・おうち情報などを常設表示し、  
**「見るだけで今の状況が分かる」**ことを最優先に設計している。

本プロジェクトは、  
**最終的に「素の HTML / CSS / JavaScript」として納品可能な構成**を前提としている。

---

## コンセプト

- 家族専用・据え置き利用前提
- 横置き Android タブレット特化
- 操作性より **視認性・即時性** を優先
- 機能は増やしすぎず、必要最小限に
- 将来の拡張（PWA強化 / Firestore導入）を見据えた設計

---

## メイン画面の役割

**「今、この家がどういう状態かを一瞬で把握する」**

### 表示内容（確定）

- 大きめデジタル時計（最優先）
- 今日の天気
- 各人ページへのボタン  
  - ゆうま  
  - あしゃ  
  - そーくん
- ちゃっぴー起動ボタン（ChatGPT へワンクリック）
- おうちの情報
  - ゴミの日
  - 家族への一時メモ（ホワイトボード的用途）

---

## 個人ページ（想定）

### ゆうまページ
- 今日の予定
- 今やること（最大3つ）
- 見通し・安心感を重視したUI

### あしゃページ
- 未実装

### そーくんページ
- 出勤時に持ち物の確認ができるように「タクシーメーター風」のチェックリストを配置
- 遊び心で右半分のブロックには、推しキャラの画像をコメントがランダムで表示されるように

---

## 技術スタック

※ **ビルドツールとして使用。実行時依存はなし**

- **Vite**
- **Handlebars**（vite-plugin-handlebars）
- **Sass**
- **ES Modules**
- **PWA 対応（予定）**
- **Firestore（必要になった場合のみ導入）**
- デプロイ：**Vercel**

### パッケージ管理
- **pnpm**
  - 高速・安定した依存管理のため採用
  - 最終納品物（dist）には一切影響しない

---
## 開発方針・メモ

### JavaScript 設計

- **HTML 1ページにつき 1エントリ JS**
- ページ固有の処理は各ページ用 JS に記述
- **共通処理は `import` で共有**
- `main.js` は **アプリ全体の初期化ハブ**

#### main.js の役割

- Sass（CSS）の読み込み
- 共通機能 JS の `import`
- `DOMContentLoaded` 後の初期化処理

---

## パス設計ルール（重要）

### JavaScript（import）

- **相対パスで記述**
- 基準は「その JS ファイルの位置」
//import { initClock } from './features/clock.js';

データ・リソース（fetch / img / a など）
ルート基準パスで統一
fetch('/src/data/garbage.json');

## ディレクトリ構成

```txt
/
├ index.html                # メイン画面（エントリ）
├ vite.config.js
├ package.json
├ pnpm-lock.yaml
│
├ dist/                     # build 出力（最終納品物）
│
├ public/                   # そのまま配信される静的ファイル
│  ├ icons/
│  └ images/
│
└ src/
   ├ pages/                 # 下層ページ
   │  ├ yuuma.html
   │  ├ asha.html
   │  └ so.html
   │
   ├ partials/              # Handlebars partials
   │
   ├ styles/
   │  └ style.scss          # 共通スタイル（全ページ）
   │
   ├ scripts/
   │  ├ main.js             # メイン画面用エントリ
   │  ├ yuuma.js            # ゆうまページ用
   │  ├ asha.js             # あしゃページ用
   │  ├ so.js               # そーくんページ用
   │
   ├ features/              # 機能単位のJS（共通）
   │  ├ clock.js
   │  ├ weather.js
   │  ├ garbage.js
   │  └ homeMemo.js
   │
   └ data/                  # JSON 管理データ
      ├ family.json
      ├ garbage.json
      └ config.json