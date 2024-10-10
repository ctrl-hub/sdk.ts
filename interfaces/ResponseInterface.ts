interface Error {
    title: String;
}

export interface InternalResponse {
    // possible API response body:
    data: object|object[],
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