# emoji-bot

Misskey インスタンスに絵文字が追加された事を知らせるBOTです。
私用する際は、`.env.example` をコピーし `.env` を作成して利用してください
`pnpm start` で起動できます。

Misskey バージョン 2023.12.1 以降はアクセストークンに以下の権限が必要です。
```js
"permission": [
        "read:admin:show-moderation-log",
        "write:notes",
        "read:drive",
        "write:drive",
        "read:admin:emoji",
        "write:admin:emoji"
    ]
```
