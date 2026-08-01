import { z } from "zod"
import { UserSchema } from "./User"
import { CustomEmojiSchema } from "./CustomEmoji"
import { AvatarDecorationSchema } from "./AvatarDecoration"

const BaseModerationLogSchema = z.object({
    id: z.string(),
    createdAt: z.coerce.date(),
    userId: z.string(),
    user: UserSchema
})

const AddCustomEmojiLogSchema = BaseModerationLogSchema.extend({
    type: z.literal("addCustomEmoji"),
    info: z.object({
        emoji: CustomEmojiSchema
    }),
})

const UpdateCustomEmojiLogSchema = BaseModerationLogSchema.extend({
    type: z.literal("updateCustomEmoji"),
    info: z.object({
        before: CustomEmojiSchema,
        after: CustomEmojiSchema
    })
})

const DeleteCustomEmojiLogSchema = BaseModerationLogSchema.extend({
    type: z.literal("deleteCustomEmoji"),
    info: z.object({
        emoji: CustomEmojiSchema
    })
})

const AddAvatarDecorationLogSchema = BaseModerationLogSchema.extend({
    type: z.literal("createAvatarDecoration"),
    info: z.object({
        avatarDecoration: AvatarDecorationSchema
    })
})

const UpdateAvatarDecorationLogSchema = BaseModerationLogSchema.extend({
    type: z.literal("updateAvatarDecoration"),
    info: z.object({
        before: AvatarDecorationSchema,
        after: AvatarDecorationSchema
    })
})

const DeleteAvatarDecorationLogSchema = BaseModerationLogSchema.extend({
    type: z.literal("deleteAvatarDecoration"),
    info: z.object({
        avatarDecoration: AvatarDecorationSchema
    })
})

export const ModerationLogSchema = z.discriminatedUnion("type", [
    AddCustomEmojiLogSchema,
    UpdateCustomEmojiLogSchema,
    DeleteCustomEmojiLogSchema,
    AddAvatarDecorationLogSchema,
    UpdateAvatarDecorationLogSchema,
    DeleteAvatarDecorationLogSchema
])
export const ModerationLogsSchema = z.array(ModerationLogSchema)

export type ModerationLog = z.infer<typeof ModerationLogSchema>