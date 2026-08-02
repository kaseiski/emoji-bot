export type Result<T, E> =
    | { ok: true; value: T }
    | { ok: false; error: E }

export const success = <T>(value: T): Result<T, never> => ({
    ok: true,
    value: value
})

export const failure = <E>(error: E): Result<never, E> => ({
    ok: false,
    error: error
})

export interface ApiBase<Req, Res, Err> {
    execute(request: Req): Promise<Result<Res, Err>>
}

export type ApiError =
    | { type: "Unauthorized" }
    | { type: "Forbidden" }
    | { type: "RateLimited" }
    | { type: "InvalidRequest"; cause: unknown }
    | { type: "Unknown"; cause: unknown }
