import z from "zod"
import { MisskeyClient } from "../MisskeyClient"
import { ApiBase, ApiError } from "../ApiBase"

export const NotesCreateRequestSchema = z.object({
    text: z.string(),
    visibility: z.string().default("public"),
    localOnly: z.boolean().default(true),
    cw: z.string().nullable().default(null)
})

export type NotesCreateRequest = z.infer<typeof NotesCreateRequestSchema>

export const createNoteApi = (client: MisskeyClient): ApiBase<NotesCreateRequest, void, ApiError> =>
    ({
        async execute(request) {
            return client.post("notes/create", request)
        }
    })