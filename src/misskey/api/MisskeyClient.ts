export class MisskeyClient {
    constructor(
        private endpoint: string,
        private token: string
    ) { }

    async post<T>(
        path: string,
        body: object = {}
    ): Promise<T> {
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
            throw new Error(
                `Misskey API Error: ${response.status}`
            )
        }

        return response.json()
    }
}