import { z } from "zod"
import { UserSchema } from "./User"

export const ModerationLogSchema = z.object({
    id: z.string(),
    createdAt: z.string(), // TODO: date で良いかも
    type: z.string(),
    info: z.any(),
    userId: z.string(),
    user: UserSchema
})
export const ModerationLogsSchema = z.array(ModerationLogSchema)

export type ModerationLog = z.infer<typeof ModerationLogSchema>