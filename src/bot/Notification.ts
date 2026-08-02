import { MisskeyApi } from "../misskey/api/MisskeyApi"
import { NotesCreateRequest } from "../misskey/api/notes/CreateNote"
import { AvatarDecoration } from "../misskey/model/AvatarDecoration"
import { CustomEmoji } from "../misskey/model/CustomEmoji"
import { ModerationLog } from "../misskey/model/ModerationLog"
import { User } from "../misskey/model/User"
import { Logger } from "../utils/logger"
import { EmojiBotOptions } from "./options"

export class Notification {
    protected options: EmojiBotOptions
    protected user?: User
    protected api

    constructor(
        options: EmojiBotOptions,
        api: MisskeyApi
    ) {
        this.api = api
        this.options = options
    }

    private sendNote(
        text: string,
        visibility: string,
        cw: string | null
    ) {
        const params = {
            text: text,
            visibility: visibility,
            localOnly: this.options.localOnly,
            cw: cw
        } satisfies NotesCreateRequest
        if (this.options.isDryRun) {
            Logger.info("isDryRun=true のため投稿しません")
            Logger.info(text)
        } else {
            this.api.notes.create.execute(params)
        }
    }

    // カスタム絵文字が追加された時の処理
    private addCustomEmoji(emoji: CustomEmoji, user: User) {
        if (user.username != this.user?.username) {
            // 通知
            const cw = this.options.useCW.add ? `新しい絵文字が追加されたかも! :${emoji.name}:\n` : null
            const header = this.options.useCW.add ? "" : "新しい絵文字が追加されたかも!\n"
            const text = `${header}\`:${emoji.name}:\` => :${emoji.name}: \n\n【カテゴリー】\n\`${emoji.category}\`\n\n【ライセンス】\n\`${emoji.license}\`\n\n追加した人：@${user.username}`

            this.sendNote(text, this.options.visibility.add, cw)
        }
    }

    // カスタム絵文字が更新された時の処理
    private updateCustomEmoji(emoji: CustomEmoji, user: User) {
        if (user.username != this.user?.username) {
            // 通知
            const cw = this.options.useCW.update ? `絵文字が更新されたかも! :${emoji.name}:\n` : null
            const header = this.options.useCW.update ? "" : "絵文字が更新されたかも!\n"
            const text = `${header}\`:${emoji.name}:\` => :${emoji.name}: \n\n【カテゴリー】\n\`${emoji.category}\`\n\n【ライセンス】\n\`${emoji.license}\`\n\n更新した人：@${user.username}`

            this.sendNote(text, this.options.visibility.update, cw)
        }
    }

    // カスタム絵文字が削除された時の処理
    private deleteCustomEmoji(emoji: CustomEmoji, user: User) {
        if (user.username != this.user?.username) {
            const cw = this.options.useCW.delete ? "カスタム絵文字が削除されたみたい…\n" : null
            const header = this.options.useCW.delete ? "" : "カスタム絵文字が削除されたみたい…\n"
            const text = `${header}\`:${emoji.name}:\` \n\n削除した人：@${user.username}`

            this.sendNote(text, this.options.visibility.delete, cw)
        }
    }

    private createAvatarDecoration(deco: AvatarDecoration, user: User) {
        const cw = this.options.useCW.add ? `新しいデコレーションが追加されたかも!\n\`${deco.name}\`` : null
        const header = this.options.useCW.add ? "" : "新しいデコレーションが追加されたかも!\n"
        const text = `${header}\`${deco.name}\` => ${deco.url} \n\n追加した人：@${user.username}`

        this.sendNote(text, this.options.visibility.add, cw)
    }

    private updateAvatarDecoration(deco: AvatarDecoration, user: User) {
        const cw = this.options.useCW.update ? `デコレーションが更新されたかも!\n\`${deco.name}\`` : null
        const header = this.options.useCW.update ? "" : "デコレーションが更新されたかも!\n"
        const text = `${header}\`${deco.name}\` => ${deco.url} \n\n更新した人：@${user.username}`

        this.sendNote(text, this.options.visibility.update, cw)

    }

    private deleteAvatarDecoration(deco: AvatarDecoration, user: User) {
        const cw = this.options.useCW.delete ? "デコレーションが削除されたみたい…" : null
        const header = this.options.useCW.delete ? "" : "デコレーションが削除されたみたい…\n"
        const text = `${header}\`${deco.name}\` \n\n削除した人：@${user.username}`

        this.sendNote(text, this.options.visibility.delete, cw)
    }

    // モデレーションログを受け取って、それを元に何かしらの処理を実行するメソッド
    notify(moderationLog: ModerationLog, user: User) {
        this.user = user
        switch (moderationLog.type) {
        case "addCustomEmoji":
            this.addCustomEmoji(moderationLog.info.emoji, moderationLog.user)
            break
        case "updateCustomEmoji":
            this.updateCustomEmoji(moderationLog.info.after, moderationLog.user)
            break
        case "deleteCustomEmoji":
            this.deleteCustomEmoji(moderationLog.info.emoji, moderationLog.user)
            break
        case "createAvatarDecoration":
            this.createAvatarDecoration(moderationLog.info.avatarDecoration, moderationLog.user)
            break
        case "updateAvatarDecoration":
            this.updateAvatarDecoration(moderationLog.info.after, moderationLog.user)
            break
        case "deleteAvatarDecoration":
            this.deleteAvatarDecoration(moderationLog.info.avatarDecoration, moderationLog.user)
            break
        default:
            Logger.info("その他なんか:" + moderationLog)
            break
        }
    }
}