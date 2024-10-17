interface Error {
    title: String;
    statusCode: String;
}

export type InternalResponse = {
    // possible API response body:
    data: object|object[]|null,
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