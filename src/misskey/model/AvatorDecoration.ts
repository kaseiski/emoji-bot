import z from "zod"

export const AvatorDecorationSchema = z.object({
    id: z.string(),
    url: z.string(),
    name: z.string(),
    description: z.string(),
    updatedAt: z.string()
})

export type AvatorDecoration = z.infer<typeof AvatorDecorationSchema>
