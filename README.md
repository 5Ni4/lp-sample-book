# LP Sample Book

業種や目的の違うLPを見られる、静的なポートフォリオサイトです。デザイン、更新しやすさ、記事下書き作成の流れを紹介する目的で作っています。

## サンプル

- 飲食・多店舗：架空の「街の食卓グループ」。食堂・麺処・酒場の3ブランド、6店舗を紹介するグループサイト
- キャラクター・LINE：524キャラクターを使ったLINEスタンプ紹介ページ
- イベント・地域：架空の「まちの輪マルシェ」案内

トップページのカテゴリボタンで絞り込み、各カードからサンプルLPを開けます。

## デモの範囲

- 524のキャラクター画像を使用しています。スタンプセット名、収録数、価格、販売状況、購入先URLは設定していません。
- 飲食会社、ブランド、店舗、メニュー、価格、イベント、日時、会場、出店者、連絡先などはサンプル用の架空情報です。
- 飲食グループの料理写真は、サンプル用の生成画像です。
- 記事作成ボタンは固定の文章を表示する画面プロトタイプです。MCP、生成AI、Headless CMSには接続していません。
- フォームは入力内容を送信・保存しません。LINEアプリや販売ページにも接続していません。
- 実際の案件で使う場合は、サービス内容、事実、料金、利用権限、CMS、MCPの接続先、確認・公開手順を個別に決めます。

## 公開ページ

GitHub Pagesで `main` ブランチのルートから公開しています。

- サイト：https://5ni4.github.io/lp-sample-book/
- 飲食・多店舗：https://5ni4.github.io/lp-sample-book/sites/restaurant/
- キャラクター・LINE：https://5ni4.github.io/lp-sample-book/sites/524-line-stickers/
- イベント・地域：https://5ni4.github.io/lp-sample-book/sites/local-marche/

## ローカルで見る

`index.html` をブラウザーで開きます。外部ライブラリやビルド工程はありません。

## ディレクトリー

- `index.html`：カテゴリ一覧とサンプル集トップ
- `assets/styles.css`：共通デザイン
- `assets/site.js`：カテゴリ絞り込み・画面デモ
- `assets/favicon.svg`：サンプルブックのアイコン
- `assets/524-stickers/`：524のキャラクター画像
- `assets/restaurant/`：飲食グループの料理写真
- `sites/restaurant/index.html`：複数店舗を運営する飲食会社
- `sites/524-line-stickers/index.html`：524のLINEスタンプ紹介
- `sites/local-marche/index.html`：地域マルシェ

## GitHub Pages

GitHub Pagesの公開元は、ブランチ `main`、フォルダー `/ (root)` です。
