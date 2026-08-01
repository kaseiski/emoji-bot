import z from "zod"

export const AvatarDecorationSchema = z.object({
    id: z.string(),
    url: z.string(),
    name: z.string(),
    description: z.string(),
    updatedAt: z.string().nullable()
}).loose()

export type AvatarDecoration = z.infer<typeof AvatarDecorationSchema>
