import * as dotenv from "dotenv"

// TODO: 後でNamespace で良い感じに整理してあげましょうね

export type EmojiBotOptions = {
    // 対象のホスト名 - 例：misskey.io / kasei.ski 等
    host: string,

    // BOTアカウントのAPI token。ノートの投稿の権限さえあればOK
    token: string,

    // 実際にノートを投稿するかどうか。true ならノートを投稿しない。
    // 初回起動時など、大量のノートを送信する可能性がある場合はtrueにしたほうが良い
    isDryRun: boolean,

    // 何秒に１度ポーリングを実行するか
    intervals: number,

    // 一度に受け取る絵文字の数(APIのデフォルト)
    limit: number,

    // 送られてきたカスタム絵文字をemoji_bot君が再投稿しなおすかどうか
    isReUpload: boolean,

    // 投稿範囲の設定（add:追加, update:更新, delete:削除）
    visibility: {
        add: string,
        update: string,
        delete: string,
    },

    // CWをかけるかどうか（add:追加, update:更新, delete:削除）
    useCW: {
        add: boolean,
        update: boolean,
        delete: boolean,
    },

    // 連合をオフにするかどうか
    localOnly: boolean
}

export function loadEmojiBotOptions(): EmojiBotOptions {

    dotenv.config()

    if (!process.env.HOST_NAME) {
        console.log("HOST_NAME が指定されていません")
        process.exit(1)
    }
    if (!process.env.API_TOKEN) {
        console.log("API_TOKENが指定されていません")
        process.exit(1)
    }

    const options: EmojiBotOptions = {
        host: process.env.HOST_NAME,
        token: process.env.API_TOKEN,
        isDryRun: JSON.parse(process.env.IS_DRY_RUN?.toString() ?? "true") as boolean,
        intervals: parseInt(process.env.INTERVALS ?? "60"),
        limit: parseInt(process.env.API_LIMIT ?? "30"),
        isReUpload: JSON.parse(process.env.IS_REUPLOAD?.toString() ?? "false") as boolean,
        visibility: {
            add: process.env.VISIBILITY_ADD ?? "public",
            update: process.env.VISIBILITY_UPDATE ?? "home",
            delete: process.env.VISIBILITY_DELETE ?? "home",
        },
        useCW: {
            add: JSON.parse(process.env.USE_CW_ADD?.toString() ?? "false") as boolean,
            update: JSON.parse(process.env.USE_CW_UPDATE?.toString() ?? "false") as boolean,
            delete: JSON.parse(process.env.USE_CW_DELETE?.toString() ?? "false") as boolean,
        },
        localOnly: JSON.parse(process.env.LOCAL_ONLY?.toString() ?? "false") as boolean
    }
    return options
}