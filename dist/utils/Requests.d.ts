import { RequestOptions } from "./RequestOptions";
export declare class Requests {
    static buildRequestURL(baseEndpoint: string, param?: string | RequestOptions | null): string;
    static buildInternalResponse(fetchResponse: any, json: any): {
        ok: any;
        statusCode: any;
        headers: any;
        meta: any;
        links: any;
        data: any;
        included: any;
        errors: {
            client: never[];
            network: never[];
            api: any;
        };
    };
    static buildInternalErrorResponse(error: any): {
        ok: boolean;
        statusCode: any;
        headers: any;
        data: null;
        errors: {
            client: never[];
            network: any[];
            api: never[];
        };
        meta: null;
        links: {};
        included: never[];
    };
}
//# sourceMappingURL=Requests.d.ts.map