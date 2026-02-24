# Freelance Folder Operation Cheat Sheet
最終更新：2026-02

---

# ■ 目的

案件・顧客・素材・事務データを  
統一ルールで管理し、検索性・拡張性・自動化を最大化する。

この構成は将来的にAPI連携・自作管理アプリ参照を前提に設計されている。  
フォルダ構造は絶対固定。

---

# ■ ルート構造（変更禁止）

Freelance/
├ Clients
├ Projects
├ Assets
├ Templates
├ Admin
└ Inbox

---

# ■ 第一階層の役割

## Clients
顧客情報のみ保存。案件制作データは置かない。

## Projects
制作作業専用フォルダ。

## Assets
案件に依存しない共有素材。

## Templates
雛形専用。案件開始時はここをコピー。

## Admin
経理・契約など業務管理用。

## Inbox
仮置き場。毎日空にする。

---

# ■ 案件フォルダ作成手順（必須）

① Templates/project_starter をコピー  
② フォルダ名を変更  
③ 作業開始  

---

# ■ 案件フォルダ命名ルール

YYYY-MM_案件名_会社名

例：
2026-02_ロゴ制作_株式会社〇〇

---

# ■ project_starter 構成（固定）

01_brief  
02_source  
03_export  
04_preview  
05_client_material  
06_reference  
07_admin  
memo.md  

新フォルダを勝手に追加しない。

---

# ■ 各フォルダの用途

## 01_brief
仕様書・要件・ワイヤーなど設計資料

## 02_source
制作データ本体（ai, psd, fig, html, css など）  
ここ以外で制作しない

## 03_export
納品用データ（png, jpg, pdf, zip）

## 04_preview
クライアント確認用画像

## 05_client_material
クライアント支給素材

## 06_reference
参考デザイン・スクショ

## 07_admin
見積書・請求書・契約書

## memo.md
修正履歴・決定事項・ログ

---

# ■ ファイル命名規則（必須）

YYYYMMDD_種別_案件名_内容_v01.ext

例：
20260220_logo_cafeA_main_v01.ai  
20260220_invoice_clientA_v01.pdf

---

# ■ 種別コード

logo  
banner  
lp  
site  
illust  
invoice  
contract  

---

# ■ 保存判断ロジック

これは案件データ？
→ YES → Projects

顧客情報？
→ YES → Clients

素材？
→ YES → Assets

どれでもない？
→ Inbox

迷ったら Inbox。

---

# ■ 絶対ルール

制作データ → 02_source  
納品データ → 03_export  
支給素材 → 05_client_material  

日本語フォルダ名を作らない  
階層を変更しない  
ルート直下に保存しない  

---

# ■ 禁止事項

× 勝手にフォルダ追加  
× 案件フォルダに独自階層を作る  
× source以外で制作  
× Inboxを放置  

---

# ■ 設計思想

この構成は

・探さない  
・迷わない  
・再現できる  
・自動検索可能  
・API参照可能  

を前提に設計されている。

案件が100件になっても崩れない構造を守ること。