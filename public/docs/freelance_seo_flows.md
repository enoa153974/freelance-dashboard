# SEO初期設定チェックリスト（ポートフォリオ / LP用）

---

## ■ フェーズ①：検索エンジンに認識させる（土台構築）

### ① Google Search Console登録
- [ ] ドメインプロパティ or URLプレフィックスで登録
- [ ] 所有権確認（DNS or HTMLタグ）

---

### ② サイトマップ作成

#### ▶ Astroの場合

```lang
npm install @astrojs/sitemap
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',
  integrations: [sitemap()]
});

```  

 /sitemap-index.xml が生成されている
 ブラウザでアクセス可能


 #### ▶ ノンフレームワーク（HTML/CSS/JS）の場合

手動で作成：
```lang
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
  </url>
  <url>
    <loc>https://example.com/about/</loc>
  </url>
</urlset>

```

 /sitemap.xml を public or ルートに配置
 ブラウザでアクセス可能

---

#### ③ サイトマップ送信（Search Console）
https://example.com/sitemap.xml
または
https://example.com/sitemap-index.xml
でステータス「成功」になればOK！

---

#### ④ robots.txt設置
```lang
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml

```
※Astroの場合は sitemap-index.xml

---


## ■ フェーズ②：検索結果に正しく表示させる（メタ情報）

⑤ Titleタグ最適化（最重要）
<title>タイトル｜キーワードを含む説明入れる</title>
職種
提供サービス
サイト内容

---

⑥ Description設定
<meta name="description" content="LP制作・Webデザイン・コーディング対応。成果につながるデザインをご提案します。">

---

⑦ canonical設定
<link rel="canonical" href="https://example.com/">

---

⑧ robots meta
<meta name="robots" content="index, follow">

---

⑨ OGP設定（SNS対策）
<meta property="og:title" content="サイトタイトル">
<meta property="og:description" content="説明文">
<meta property="og:image" content="https://example.com/ogp.jpg">
<meta property="og:url" content="https://example.com/">
<meta property="og:type" content="website">

### ■ フェーズ③：インデックス促進
⑩ URL検査 → インデックスリクエスト

対象：
下層ページ（インデックス登録ひとつずつしていく）

---

⑪ 内部リンク設計
 ナビゲーションあり
 TOP → 各ページ導線あり
 フッターリンクあり

### ■ フェーズ④：コンテンツSEO

⑫ 見出し構造
```lang
<h1>ページタイトル</h1>
<h2>セクション</h2>
<h3>詳細</h3>
 -h1は1つ
 -階層構造が正しい
```
---

⑬ 画像alt設定(例)
<img src="lp.jpg" alt="LPデザイン制作実績（美容サービス）">

---

⑭ worksページ強化
 制作意図
 使用技術（HTML/CSS/JSなど）
 課題 → 解決 → 成果

---

⑮ コンテンツ（記事）
 記事1本以上（columnsなど）
 制作ノウハウ or 実績解説

### ■ フェーズ⑤：分析

⑯ Google Analytics
 タグ設置済み
 動作確認OK

---

⑰ Search Console
 インデックス状況確認
 エラーなし

---

■ 補足
Keywordsタグ
不要（Googleは評価しない）
インデックス反映時間
通常：1〜7日
SEOの考え方
初期設定 → 「検索される準備」
コンテンツ → 「検索で勝つ」