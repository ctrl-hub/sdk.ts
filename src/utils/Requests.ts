import {RequestOptions} from "./RequestOptions";
import {InternalResponse} from "../types/Response";

export class Requests {

    public static buildRequestURL(baseEndpoint: string, param?: string | RequestOptions | null): string {
        let endpoint = baseEndpoint;
        if (param instanceof RequestOptions) {
            endpoint += `?${param.toURLSearchParams().toString()}`;
        } else if (typeof param === 'string') {
            endpoint += `/${param}`;
        }
        return endpoint;
    }

    public static buildInternalResponse(fetchResponse: any, json: any): InternalResponse {
        return {
            ok: fetchResponse.ok, // @todo convert to own version
            statusCode: fetchResponse.status,
            headers: fetchResponse.headers,
            meta: json?.meta || null,
            links: json?.links || null,
            data: json?.data || null,
            included: json?.included || null,
            errors: {
                client: [],
                network: [],
                api: json?.errors || [],
            }
        };
    }

    public static buildInternalErrorResponse(error: any): InternalResponse {
        return {
            ok: false,
            statusCode: error.statusCode || 0, // If there's no response, status code is 0
            headers: error.headers,
            data: null,
            errors: {
                client: [],
                network: [error],
                api: [],
            },
            meta: null,
            links: {},
            included: []
        };
    }

}