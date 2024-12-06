interface Error {
    title: String;
    statusCode: String;
}

export interface JsonData {
    id: string;
    type: string;
    attributes?: Record<string, any>;
    relationships?: Record<string, { data: any[] }>;
    meta?: Record<string, any>;
    links?: string[];
}

export interface InternalResponse<T = any> {
    // possible API response body:
    data: T,
    errors: {
        client: object[],
        network: object[],
        api: Error[],
    },
    meta: any,
    links: Record<string, string | object>,
    included: object[]
    // inferred response status:
    ok: boolean,
    statusCode: number,
    headers: object,
}