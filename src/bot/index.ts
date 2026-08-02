import * as fs from "fs"
import { EmojiBotOptions, loadEmojiBotOptions } from "./options"
import { ModerationLog } from "../misskey/model/ModerationLog"
import { Notification } from "./Notification"
import { User } from "../misskey/model/User"
import { MisskeyClient } from "../misskey/api/MisskeyClient"
import { GetRecentModerationLogs } from "../misskey/api/GetRecentModerationLogs"
import { createMisskeyApi, MisskeyApi } from "../misskey/api/MisskeyApi"
import { Logger } from "../utils/logger"

// TODO: 設定で変更できるようにする？
const dbfilename = "moderation.json"

export class EmojiBot {
    protected options: EmojiBotOptions
    protected api: MisskeyApi

    // TODO: この辺りは後でDIする
    protected getRecentModerationLogs
    protected notification

    // 使う奴
    protected lastModified: Date
    protected user?: User

    constructor(options?: EmojiBotOptions) {
        // オプションの読み込み
        if (options) {
            this.options = options
        } else {
            this.options = loadEmojiBotOptions()
        }

        this.api = createMisskeyApi(new MisskeyClient(`https://${this.options.host}`, this.options.token))

        this.getRecentModerationLogs = new GetRecentModerationLogs(this.api)
        this.notification = new Notification(this.options, this.api)

        // 起動時に最後のモデレーションログを読み込み。
        // 存在しなければ、現在時刻を返す
        this.lastModified = new Date()
        if (fs.existsSync(dbfilename)) {
            const lastModetationLog = JSON.parse(fs.readFileSync(dbfilename, "utf8")) as ModerationLog
            this.lastModified = new Date(lastModetationLog.createdAt)
        }
    }

    async run() {
        // 自分自身のログイン情報を取得する
        const result = await this.api.i.execute()

        if (!result.ok) {
            Logger.error(result.error.type)
            return
        } else {
            this.user = result.value
            Logger.success(`Login: ${this.user.username}`)
        }

        // TODO: Promise を使って、もっとちゃんと綺麗に実装して、どうぞ
        setInterval(this.pullModerationLogs, this.options.intervals * 1000)
    }

    protected pullModerationLogs = async () => {

        const result =
            await this.getRecentModerationLogs.execute(
                this.lastModified,
                this.options.limit
            )

        if (!result.ok) {
            Logger.error(`Failed to fetch moderation logs: ${result.error.type}`)
            return
        }

        const moderationLogs = result.value

        if (!this.user) {
            moderationLogs.forEach(
                moderationLog =>
                    this.notification.notify(
                        moderationLog,
                        this.user!
                    )
            )
        }

        const latestModerationLog = moderationLogs.at(-1)

        if (latestModerationLog) {
            fs.writeFileSync(
                dbfilename,
                JSON.stringify(latestModerationLog)
            )

            this.lastModified =
                new Date(latestModerationLog.createdAt)
        }
    }
}
