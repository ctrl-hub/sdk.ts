import type { Model } from "../types/Model";
type Actor = {
    type: string;
    id: string;
};
type RequestHeaders = Record<string, string[]>;
type Request = {
    time: string;
    headers: RequestHeaders;
    body: string;
    path: string;
    query: Record<string, string[]>;
    raw_query: string;
    method: string;
    content_length: number;
};
type ResponseHeaders = Record<string, string[]>;
type Response = {
    time: string;
    body: string;
    headers: ResponseHeaders;
    status: number;
};
type Attributes = {
    actor: Actor;
    duration: number;
    request: Request;
    response: Response;
};
export declare class Log implements Model {
    id: string;
    type: string;
    attributes: Attributes;
    meta: any;
    relationships: any[];
    links: any;
    constructor();
    static hydrate(data: any): Log;
}
export {};
