import { RequestOptions } from "./RequestOptions";
import { InternalResponse } from "../types/Response";
export declare class Requests {
    static buildRequestURL(baseEndpoint: string, param?: string | RequestOptions | null): string;
    static buildInternalResponse(fetchResponse: any, json: any): InternalResponse;
    static buildInternalErrorResponse(error: any): InternalResponse;
}
