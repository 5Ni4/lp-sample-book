# パン屋 あさまど
架空店舗の制作サンプル。定休日は月曜・火曜とし、営業日カレンダーは日本時間の月を表示します。実店舗・予約・販売とは連動しません。

## ブログとmicroCMS
現在のブログは見本記事を表示しています。microCMSアカウントにはまだ接続していません。
リスト形式のAPIでエンドポイント `blog` を作り、次のフィールドを用意します。

- `title`: テキスト（必須）
- `category`: テキスト
- `summary`: テキストエリア
- `body`: テキストエリア（必須、改行で段落を分ける）

サービスIDとGET専用のAPIキーを、公開ブラウザではなく、ローカルまたは非公開のビルド設定に設定します。環境変数名は `MICROCMS_SERVICE_ID` と `MICROCMS_GET_KEY` です。エンドポイント名が違う場合は `MICROCMS_ENDPOINT` も設定します。キーをGit、JS、HTMLに書き込まないでください。

```sh
node --test scripts/sync-microcms.test.mjs
node scripts/sync-microcms.mjs
```

公開記事だけを取得し、成功した場合にだけ `blog/posts.json` を置き換えます。日付は日本時間。JSは文字列として表示し、HTMLを実行しません。管理画面で公開 → 取得コマンド → 差分・本番の確認という順番です。Webhookでの自動反映はまだ設定していません。サイトへの配信は、ブログに公開することが確定した本文のみです。

## 写真・店舗について

トップ写真：Felicity Tai, [Person Baking Croissants](https://www.pexels.com/photo/person-baking-croissants-7966376/)（[Pexels License](https://www.pexels.com/license/)、トリミングとWebP最適化）。実在の店舗の写真として扱っていません。
あさまど、店舗名・営業時間は架空の制作サンプルです。店舗案内図は実際の地理・経路を示しません。サイト本文に制作者向けの注釈を入れず、作品の説明と素材情報はここで管理します。検索向けの店舗構造化データや実在店舗への経路リンクは載せません。

公開前に `node --test sites/asamado/scripts/*.test.mjs` を実行します。売り場に立った人へ案内する言葉だけを残し、制作側の説明は本文・ブログ・画面内の注釈には出さないでください。フォームなど実際に使えない機能がある別サイトでは、必要な制限だけが操作のそばで分かるようにします。
