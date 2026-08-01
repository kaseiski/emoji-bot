import { AvatorDecoration } from "../misskey/model/AvatorDecoration"
import { CustomEmoji } from "../misskey/model/CustomEmoji"
import { ModerationLog } from "../misskey/model/ModerationLog"
import { User } from "../misskey/model/User"
import { CreateNote } from "../service/CreateNote"
import { Logger } from "../utils/logger"
import { EmojiBotOptions } from "./options"

export class Notification {
    protected options: EmojiBotOptions
    protected user?: User

    constructor(
        private createNote: CreateNote,
        options: EmojiBotOptions
    ) {
        this.options = options
    }

    // カスタム絵文字が追加された時の処理
    private addCustomEmoji(moderationLog: ModerationLog) {
        const emoji = moderationLog.info.emoji as CustomEmoji
        const user = moderationLog.user as User

        if (user.username != this.user?.username) {
            // 通知
            const cw = this.options.useCW.add ? `新しい絵文字が追加されたかも! :${emoji.name}:\n` : null
            const header = this.options.useCW.add ? "" : "新しい絵文字が追加されたかも!\n"
            const message = `${header}\`:${emoji.name}:\` => :${emoji.name}: \n\n【カテゴリー】\n\`${emoji.category}\`\n\n【ライセンス】\n\`${emoji.license}\`\n\n追加した人：@${user.username}`

            if (this.options.isDryRun) {
                Logger.info("isDryRun=true のため投稿しません")
                Logger.info(message)
            } else {
                this.createNote.execute(message, this.options.visibility.add, this.options.localOnly, cw)
            }
        }
    }

    // カスタム絵文字が更新された時の処理
    private updateCustomEmoji(moderationLog: ModerationLog) {
        const after = moderationLog.info.after as CustomEmoji
        const user = moderationLog.user as User

        if (user.username != this.user?.username) {
            // 通知
            const cw = this.options.useCW.update ? `絵文字が更新されたかも! :${after.name}:\n` : null
            const header = this.options.useCW.update ? "" : "絵文字が更新されたかも!\n"
            const message = `${header}\`:${after.name}:\` => :${after.name}: \n\n【カテゴリー】\n\`${after.category}\`\n\n【ライセンス】\n\`${after.license}\`\n\n更新した人：@${user.username}`
            if (this.options.isDryRun) {
                Logger.info("isDryRun=true のため投稿しません")
                Logger.info(message)
            } else {
                this.createNote.execute(message, this.options.visibility.update, this.options.localOnly, cw)
            }
        }
    }

    // カスタム絵文字が削除された時の処理
    private deleteCustomEmoji(moderationLog: ModerationLog) {
        const emoji = moderationLog.info.emoji as CustomEmoji
        const user = moderationLog.user as User

        if (user.username != this.user?.username) {
            const cw = this.options.useCW.delete ? "カスタム絵文字が削除されたみたい…\n" : null
            const header = this.options.useCW.delete ? "" : "カスタム絵文字が削除されたみたい…\n"
            const message = `${header}\`:${emoji.name}:\` \n\n削除した人：@${user.username}`
            if (this.options.isDryRun) {
                Logger.info("isDryRun=true のため投稿しません")
                Logger.info(message)
            } else {
                this.createNote.execute(message, this.options.visibility.delete, this.options.localOnly, cw)
            }
        }
    }

    private createAvatarDecoration(moderationLog: ModerationLog) {
        const deco = moderationLog.info.avatarDecoration as AvatorDecoration
        const user = moderationLog.user as User

        const cw = this.options.useCW.add ? `新しいデコレーションが追加されたかも!\n\`${deco.name}\`` : null
        const header = this.options.useCW.add ? "" : "新しいデコレーションが追加されたかも!\n"
        const message = `${header}\`${deco.name}\` => ${deco.url} \n\n追加した人：@${user.username}`
        if (this.options.isDryRun) {
            Logger.info("isDryRun=true のため投稿しません")
            Logger.info(message)
        } else {
            this.createNote.execute(message, this.options.visibility.add, this.options.localOnly, cw)
        }
    }

    private updateAvatorDecoration(moderationLog: ModerationLog) {
        const deco = moderationLog.info.after as AvatorDecoration
        const user = moderationLog.user as User

        const cw = this.options.useCW.update ? `デコレーションが更新されたかも!\n\`${deco.name}\`` : null
        const header = this.options.useCW.update ? "" : "デコレーションが更新されたかも!\n"
        const message = `${header}\`${deco.name}\` => ${deco.url} \n\n更新した人：@${user.username}`
        if (this.options.isDryRun) {
            Logger.info("isDryRun=true のため投稿しません")
            Logger.info(message)
        } else {
            this.createNote.execute(message, this.options.visibility.update, this.options.localOnly, cw)
        }
    }

    private deleteAvatorDecoration(moderationLog: ModerationLog) {
        const deco = moderationLog.info.avatarDecoration as AvatorDecoration
        const user = moderationLog.user as User

        const cw = this.options.useCW.delete ? "デコレーションが削除されたみたい…" : null
        const header = this.options.useCW.delete ? "" : "デコレーションが削除されたみたい…\n"
        const message = `${header}\`${deco.name}\` \n\n削除した人：@${user.username}`
        if (this.options.isDryRun) {
            Logger.info("isDryRun=true のため投稿しません")
            Logger.info(message)
        } else {
            this.createNote.execute(message, this.options.visibility.delete, this.options.localOnly, cw)
        }
    }

    // モデレーションログを受け取って、それを元に何かしらの処理を実行するメソッド
    notify(moderationLog: ModerationLog, user: User) {
        this.user = user
        switch (moderationLog.type) {
        case "addCustomEmoji":
            this.addCustomEmoji(moderationLog)
            break
        case "updateCustomEmoji":
            this.updateCustomEmoji(moderationLog)
            break
        case "deleteCustomEmoji":
            this.deleteCustomEmoji(moderationLog)
            break
        case "createAvatarDecoration":
            this.createAvatarDecoration(moderationLog)
            break
        case "updateAvatarDecoration":
            this.updateAvatorDecoration(moderationLog)
            break
        case "deleteAvatarDecoration":
            this.deleteAvatorDecoration(moderationLog)
            break
        default:
            Logger.info("その他なんか:" + moderationLog)
            break
        }
    }
}