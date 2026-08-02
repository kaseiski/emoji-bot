import { z } from "zod"
import { MisskeyClient } from "../MisskeyClient"
import { ModerationLog } from "../../model/ModerationLog"
import { ApiBase, ApiError } from "../ApiBase"

export const AdminShowModerationLogsRequestSchema = z.object({
    allowPartial: z.boolean(),
    limit: z.number().default(30),
    type: z.string().nullable().default(null),
    userId: z.string().nullable().default(null),
    untilId: z.string().optional()
})

export type AdminShowModerationLogsRequest = z.infer<typeof AdminShowModerationLogsRequestSchema>

export const adminShowModerationLogsApi = (client: MisskeyClient): ApiBase<AdminShowModerationLogsRequest, ModerationLog[], ApiError> => ({
    execute(request) {
        return client.post("admin/show-moderation-logs", request)
    }
})
