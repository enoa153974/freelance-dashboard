## テンプレートを使用した開発フロー

このプロジェクトでは、`\Freelance\Templates\Projects\web-template"` に用意されたテンプレートとスクリプトを使用して  
新しい案件フォルダを自動生成してから開発を開始します。

---

### 1. 新しい案件フォルダを作成

テンプレート生成スクリプトを使用して案件フォルダを作成します。

npm run create 案件名

例）
npm run create 2026-03_コーポレートサイト制作_テスト株式会社

実行すると以下の場所に新しい案件フォルダが作成されます。

OneDrive/Freelance/Projects/2026/案件名

## 生成される内容

project-starterに開発用の
「Vite + Handlebars + SCSS Foundation Template」が組み込まれた状態で生成されます。（02_source内に格納されるsite/がテンプレです）

2. 案件フォルダへ移動
cd OneDrive/Freelance/Projects/2026/案件名

3. 依存パッケージをインストール
npm install

4. 開発サーバーを起動
npm run dev

Viteの開発サーバーが起動します。

5. ページ制作

以下の構成で開発を進めます。

src
├ assets
│  ├ js
│  └ styles
├ data
├ partials
├ index.html
└ main.js

主な役割

フォルダ	役割
assets/styles	SCSSスタイル
assets/js	UIスクリプト
data	JSONデータ
partials	Handlebarsコンポーネント
index.html	ページ構造

6. UIコンポーネントを使用して構築

テンプレートに用意されているUIコンポーネントを組み合わせてページを構築します。
例）
hero
card
cta
tabs
faq
form

必要に応じて新しいUIコンポーネントを追加します。

7. コード品質チェック

必要に応じてLintを実行します。
JavaScript【npm run lint:js】

CSS / SCSS【npm run lint:css】

HTML【npm run lint:html】

すべて実行【npm run lint】

8. ビルド
納品用ファイルを生成します。

 - npm run build
生成されたファイルは

 - dist
フォルダに出力されます。

9. 納品

dist フォルダ内のファイルを納品データとして使用します。

dist
├ index.html
├ assets
└ images
開発フローまとめ
テンプレ生成
↓
npm install
↓
npm run dev
↓
UIコンポーネントでページ構築
↓
Lintチェック
↓
npm run build
↓
distを納品

このテンプレートを使用することで
LP / コーポレートサイト制作を高速に開始できます。