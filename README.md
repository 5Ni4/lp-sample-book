# LP Sample Book

公開した作例をプレビューから選べる、静的なLPサンプル集です。

## サンプル

- 飲食・多店舗：架空の「街の食卓グループ」。3ブランド・6店舗の案内と、店舗・カテゴリで絞り込める読みもの
- キャラクター・LINE：524のキャラクターサイト。販売中のLINEスタンプ5作品とLINE絵文字5作品を掲載
- イベント・地域：架空の「まちの輪マルシェ」案内
- 通販・ネイル：架空の「mellow tips」。ネイルチップの販売ページと注文確認デモ

トップページのカテゴリボタンで絞り込み、各カードからサンプルLPを開けます。

## 飲食グループの読みもの

飲食トップに最新3件、[読みもの一覧](https://5ni4.github.io/lp-sample-book/sites/restaurant/journal/)に全6件を掲載しています。店舗とカテゴリの組み合わせで絞り込めます。絞り込み条件をURLに保持し、戻る・進むにも対応しています。各記事の末尾から関連店舗へ進めます。

記事本文はサンプル用の架空情報です。JavaScriptを無効にしても一覧と記事を読めます。

### NILTOで記事を管理する

仕事用アカウントの[制作テスト](https://cms.nilto.com/770421477/contents)に、モデル「飲食グループの読みもの」（LUID `restaurant_journal`）を作成しています。タイトル・URL名・導入文・掲載日・メイン画像・本文・カテゴリ・掲載店舗を編集できます。本文はフレキシブルテキストです。URL名には英小文字・数字・ハイフン・アンダースコアを使用し、ほかの記事と重複させないでください。

公開後、[Publish NILTO articles](https://github.com/5Ni4/lp-sample-book/actions/workflows/publish-nilto.yml)から「Run workflow」を実行すると、公開記事を取得し、一覧・記事本文・トップの最新3件を更新します。下書きはサイトに掲載されません。非公開にした記事は次の反映時に一覧・記事ページから除かれます。メイン画像を省略した場合は、選択した店舗の料理写真を表示します。

公開データ専用キーはGitHub Actionsシークレット `NILTO_PUBLIC_API_KEY` に保存しています。キーはサイトのHTMLやJavaScriptに含めません。API取得や記事の検査に失敗した場合は公開処理を止め、直前の公開版を保持します。

## デモの範囲

- 524の紹介ページに掲載するLINE作品は、[R-524のLINE STORE](https://store.line.me/stickershop/author/5984470/ja)で取り扱われる実際の商品です。各作品の販売ページにリンクしています。
- 524の送信プレビューでは、作者の制作素材から用意したスタンプ8点と絵文字6点を試せます。スタンプはタップですぐ表示し、絵文字は送信ボタンでトーク欄に表示します。入力内容はこのページだけに表示し、保存しません。
- 524ページの見出しや操作ラベルには、商用利用できる M PLUS Rounded 1c Black を使用しています。現在のページに必要な文字を含む WOFF2 と、SIL Open Font License 1.1 を同梱しています。
- 飲食会社、ブランド、店舗、メニュー、価格、イベント、日時、会場、出店者、連絡先などはサンプル用の架空情報です。
- 飲食グループの料理写真は、サンプル用の生成画像です。
- 記事作成ボタンは固定の文章を表示する画面プロトタイプです。MCP、生成AI、Headless CMSには接続していません。
- デモフォームは入力内容を送信・保存しません。
- ネイルチップの注文フォームは、フォームメーラーとPayPalでの決済を想定した画面デモです。商品選択、送料込みの合計、決済前の確認までを端末内で表示します。注文や支払いは発生しません。
- 実際の案件で使う場合は、サービス内容、事実、料金、利用権限、CMS、MCPの接続先、確認・公開手順を個別に決めます。

## 公開ページ

GitHub Pagesで、`main` ブランチのファイルにNILTOの公開記事を取り込んで公開しています。

- サイト：https://5ni4.github.io/lp-sample-book/
- 飲食・多店舗：https://5ni4.github.io/lp-sample-book/sites/restaurant/
- キャラクター・LINE：https://5ni4.github.io/lp-sample-book/sites/524-line-stickers/
- イベント・地域：https://5ni4.github.io/lp-sample-book/sites/local-marche/
- 通販・ネイル：https://5ni4.github.io/lp-sample-book/sites/nail-tips/

## ローカルで見る

`index.html` をブラウザーで開きます。外部ライブラリやビルド工程はありません。

## ディレクトリー

- `index.html`：カテゴリ一覧とサンプル集トップ
- `assets/styles.css`：共通デザイン
- `assets/gallery.css`：サンプル一覧トップのデザイン
- `assets/dining-journal.css`・`assets/dining-journal.js`：飲食ブログの表示と店舗・カテゴリ絞り込み
- `assets/sample-previews/`：各サンプルページの実画面プレビュー
- `assets/site.js`：カテゴリ絞り込み・画面デモ
- `assets/favicon.svg`：サンプルブックのアイコン
- `assets/524-line-products/`：524のキャラクター画像と、作者の入稿・制作素材から用意した商品一覧の画像
- `assets/524-line-preview/`：送信プレビューに使う各作品の絵柄
- `assets/524-fonts/`：524ページのWebフォントとライセンス
- `assets/restaurant/`：飲食グループの料理写真
- `assets/nail-tips/`：ネイルチップの商品イメージ
- `sites/restaurant/index.html`：複数店舗を運営する飲食会社
- `sites/restaurant/journal/`：読みもの一覧と6件の記事ページ
- `scripts/build-nilto-site.py`・`scripts/templates/`：NILTOから公開記事を取得してHTMLを生成する処理
- `.github/workflows/publish-nilto.yml`：NILTO記事の取得とGitHub Pagesへの公開
- `sites/524-line-stickers/index.html`：524のキャラクター紹介とLINEスタンプ・絵文字一覧
- `sites/local-marche/index.html`：地域マルシェ
- `sites/nail-tips/index.html`：ネイルチップの販売と注文確認デモ

## GitHub Pages

GitHub Pagesの公開処理はGitHub Actionsです。`main` ブランチのサイトファイルをコピーし、NILTOの公開記事を反映した成果物を配信します。リポジトリ内の6記事はローカル表示用の見本として保持し、本番ビルド時にNILTOのデータで置き換えます。

## 新しい作例を掲載する

1. この作例集向けの新作LP・サンプルサイトは、公開と同時に一覧に追加します。個別の掲載確認や候補提案は挟まず、`sites/<slug>/index.html` と `gallery-catalog.json` の `listed`（掲載名・カテゴリ・短い説明・サムネイルのパス／寸法／代替テキスト）を同じ変更に含めます。顧客の非公開資料・個人情報・公開保留を明示されたものは、この取り決めの対象外で、公開リポジトリには置きません。`unlisted` は本人から非掲載の明示指定を受けた場合だけ使います（一覧への非掲載はアクセス制限ではありません）。
2. `python3 scripts/build-gallery.py` でカードを生成し、`python3 scripts/build-gallery.py --check` で検査して同じコミットに含めます。一覧HTMLの生成範囲は手で編集しません。
3. 既存のPages公開処理は、未登録の作例・重複・画像切れ・生成漏れがあれば、公開前に失敗します。公開後は一覧と作例のリンクを開いて確認します。この検査の対象はこのリポジトリの `sites/` です。
