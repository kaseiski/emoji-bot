import { User } from "./User"

export type ModerationLog = {
    id: string,
    createdAt: string, // Dateでいけたっけ
    type: string,
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    info: any,
    userId: string, // なんでuserとuseridがあるんですかねぇ
    user: User
}
