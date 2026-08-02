import { ModerationLog } from "../model/ModerationLog"
import { ApiError, Result, success } from "./ApiBase"
import { MisskeyApi } from "./MisskeyApi"

export class GetRecentModerationLogs {

    constructor(
        private readonly api: MisskeyApi
    ) { }

    async execute(
        lastModified: Date,
        limit = 30
    ): Promise<Result<ModerationLog[], ApiError>> {

        const moderationLogs: ModerationLog[] = []

        let newLastModified = new Date()
        let untilId: string | undefined

        do {

            const result =
                await this.api.admin.showModerationLogs.execute({
                    allowPartial: true,
                    limit,
                    type: null,
                    userId: null,
                    ...(untilId && { untilId })
                })

            if (!result.ok) {
                return result
            }

            const newLogs = result.value

            untilId = newLogs.at(-1)?.id

            const oldest = newLogs.at(-1)

            if (oldest) {
                newLastModified = new Date(oldest.createdAt)
            }

            moderationLogs.push(...newLogs)

        } while (newLastModified > lastModified)

        return success(
            moderationLogs
                .filter(log => new Date(log.createdAt) > lastModified)
                .reverse()
        )
    }
}