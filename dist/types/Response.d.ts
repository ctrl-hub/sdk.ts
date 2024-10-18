interface Error {
    title: String;
    statusCode: String;
}

export interface InternalResponse<T = any> {
    // possible API response body:
    data: T | null,
    errors: {
        client: object[],
        network: object[],
        api: Error[],
    },
    meta: any,
    links: Record<string, string|object>,
    included: object[]
    // inferred response status:
    ok: boolean,
    statusCode: number,
    headers: object,
}