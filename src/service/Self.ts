import { MisskeyClient } from "../misskey/api/MisskeyClient"
import { User, UserSchema } from "../misskey/model/User"
import { Logger } from "../utils/logger"

export class Self {
    constructor(
        private api: MisskeyClient
    ) { }

    async execute(): Promise<User | undefined> {
        try {
            const response = await this.api.post("i")

            const user = UserSchema.parse(response)

            Logger.success(`Login success: @${user.username}`)

            return user

        } catch (error) {
            if (error instanceof Error) {
                Logger.error(error.message)
                return undefined
            }
        }
    }
}