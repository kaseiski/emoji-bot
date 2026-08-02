import { MisskeyClient } from "./MisskeyClient"
import { User } from "../model/User"
import { ApiBase, ApiError } from "./ApiBase"

export const SelfApi = (client: MisskeyClient): ApiBase<void, User, ApiError> => ({
    async execute() {
        return client.post("i")
    }
})