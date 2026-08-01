import { MisskeyClient } from "../misskey/api/MisskeyClient"
import { Logger } from "../utils/logger"

export class CreateNote {
    constructor(
        private api: MisskeyClient
    ) { }

    async execute(
        message: string,
        visibility: string = "public",
        localOnly: boolean,
        cw: string | null = null
    ) {
        try {
            await this.api.post(
                "notes/create",
                {
                    text: message,
                    visibility,
                    localOnly,
                    cw,
                }
            )

            Logger.success(message)

        } catch (error) {
            if (error instanceof Error) {
                Logger.error(error.message)
                return undefined
            }
        }
    }
}