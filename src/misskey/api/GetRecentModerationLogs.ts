import { Logger } from "../../utils/logger"
import { MisskeyClient } from "../MisskeyClient"
import { ModerationLog, ModerationLogsSchema } from "../model/ModerationLog"

export class GetRecentModerationLogs {
    constructor(
        private api: MisskeyClient
    ) { }

    async execute(
        lastModified: Date,
        limit: number = 30
    ): Promise<ModerationLog[]> {
        const moderationLogs: ModerationLog[] = []

        let newLastModified = new Date()
        let untilId: string | undefined

        do {
            const params = {
                allowPartial: true,
                limit,
                type: null,
                userId: null,
                ...(untilId && { untilId }),
            }

            try {
                const response = await this.api.post(
                    "admin/show-moderation-logs",
                    params
                )

                const newLogs =
                    ModerationLogsSchema.parse(response)

                untilId = newLogs.at(-1)?.id

                const oldest =
                    newLogs.at(-1)

                if (oldest) {
                    newLastModified =
                        new Date(oldest.createdAt)
                }

                moderationLogs.push(...newLogs)

            } catch (error) {
                if (error instanceof Error) {
                    Logger.error(error.message)
                }
                break
            }

        } while (newLastModified > lastModified)

        return moderationLogs
            .filter(
                log => new Date(log.createdAt) > lastModified
            )
            .reverse()
    }
}