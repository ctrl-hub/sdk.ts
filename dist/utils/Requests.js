"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Requests = void 0;
const RequestOptions_1 = require("./RequestOptions");
class Requests {
    static buildRequestURL(baseEndpoint, param) {
        let endpoint = baseEndpoint;
        if (param instanceof RequestOptions_1.RequestOptions) {
            endpoint += `?${param.toURLSearchParams().toString()}`;
        }
        else if (typeof param === 'string') {
            endpoint += `/${param}`;
        }
        return endpoint;
    }
    static buildInternalResponse(fetchResponse, json) {
        return {
            ok: fetchResponse.ok,
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
    static buildInternalErrorResponse(error) {
        return {
            ok: false,
            statusCode: error.statusCode || 0,
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
exports.Requests = Requests;
