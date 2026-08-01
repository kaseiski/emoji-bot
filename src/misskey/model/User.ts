import { z } from "zod"

// TODO: 他にもたくさんあるけど、一旦使ってるのはコレだけ
export const UserSchema = z.object({
    id: z.string(),
    username: z.string()
})

export type User = z.infer<typeof UserSchema>
