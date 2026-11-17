# LP Sample Book

業種別のLPサンプルを見られる、静的なポートフォリオサイトです。デザイン、Headless CMSによる更新運用、MCPを使った記事下書き作成の流れを紹介する目的で作っています。

## サンプル

- 飲食・食品：焼き菓子店の季節ギフト
- 美容・ウェルネス：少人数ピラティス教室
- 教室・スクール：こども絵画教室

トップページの業種ボタンで絞り込み、各カードからサンプルLPを開けます。

## デモの範囲

- 店名、サービス、価格、日程、連絡先、内容はすべて架空です。
- 記事作成のボタンは固定の文章を表示する画面プロトタイプです。MCP、生成AI、Headless CMSには接続していません。
- フォームは入力内容を送信・保存しません。
- 実際の案件で使う場合は、サービス内容、事実、料金、利用権限、CMS、MCPの接続先、確認・公開手順を個別に決めます。

## ローカルで見る

`index.html` をブラウザーで開きます。外部ライブラリやビルド工程はありません。

## GitHub Pages

GitHub Pagesを有効にする場合は、リポジトリの **Settings → Pages → Build and deployment** で、`Deploy from a branch`、ブランチ `main`、フォルダー `/ (root)` を選びます。

## ディレクトリー

```text
index.html                 業種一覧とサンプル集トップ
assets/styles.css          共通デザイン
assets/site.js             業種絞り込み・画面デモ
assets/favicon.svg         サンプルブックのアイコン
sites/bakery/index.html    焼き菓子店
sites/pilates/index.html  ピラティス教室
sites/art-class/index.html こども絵画教室
```
