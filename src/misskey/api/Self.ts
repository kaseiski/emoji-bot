import { Logger } from "../../utils/logger"
import { MisskeyClient } from "../MisskeyClient"
import { User, UserSchema } from "../model/User"

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