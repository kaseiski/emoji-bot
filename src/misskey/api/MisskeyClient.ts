import { ApiError, failure, Result, success } from "./ApiBase"

export class MisskeyClient {
    constructor(
        private endpoint: string,
        private token: string
    ) { }

    async post<T>(
        path: string,
        body: object = {}
    ): Promise<Result<T, ApiError>> {
        try {
            const response = await fetch(
                `${this.endpoint}/api/${path}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...body,
                        i: this.token
                    }),
                }
            )

            if (!response.ok) {
                return failure(
                    await this.toApiError(response)
                )
            }
            return success<T>(await response.json())
        } catch (error) {
            return failure({
                type: "Unknown",
                cause: error
            })
        }
    }

    private async toApiError(
        response: Response
    ): Promise<ApiError> {

        const status = response.status

        switch (status) {
        case 401:
            return {
                type: "Unauthorized"
            }

        case 403:
            return {
                type: "Forbidden"
            }

        case 429:
            return {
                type: "RateLimited"
            }
        }

        try {
            const body = await response.json()

            if (body?.error) {
                return {
                    type: "InvalidRequest",
                    cause: body.error
                }
            }

        } catch {
            // JSONではない
        }

        return {
            type: "Unknown",
            cause: {
                status,
            }
        }
    }
}