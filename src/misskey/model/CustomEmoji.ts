import z from "zod"

export const CustomEmojiSchema = z.object({
    id: z.string(),
    aliases: z.array(z.string()),
    name: z.string(),
    category: z.string(),
    host: z.string(),
    publicUrl: z.string(),
    originalUrl: z.string(),
    license: z.string(),
    isSensitive: z.boolean(),
    localOnly: z.boolean(),
    roleIdsThatCanBeUsedThisEmojiAsReaction: z.array(z.string())
})

export type CustomEmoji = z.infer<typeof CustomEmojiSchema>
