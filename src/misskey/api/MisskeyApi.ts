import { adminShowModerationLogsApi } from "./admin/ShowModerationLogs"
import { MisskeyClient } from "./MisskeyClient"
import { createNoteApi } from "./notes/CreateNote"
import { SelfApi } from "./Self"

export const createMisskeyApi = (
    client: MisskeyClient
) => ({
    client,
    i: SelfApi(client),
    notes: {
        create: createNoteApi(client)
    },
    admin: {
        showModerationLogs: adminShowModerationLogsApi(client)
    }
})

export type MisskeyApi = ReturnType<typeof createMisskeyApi>