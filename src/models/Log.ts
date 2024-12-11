import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';

// Update Attributes type to match the JSON structure
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

@RegisterModel
export class Log implements Model {
    public id: string = '';
    public type: string = 'logs';
    public attributes: Attributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;
    public included?: any;

    constructor(data?: Log) {
        this.id = data?.id ?? '';
        this.attributes = {
            actor: {
                type: data?.attributes?.actor?.type ?? '',
                id: data?.attributes?.actor?.id ?? '',
            },
            duration: data?.attributes?.duration ?? 0,
            request: {
                time: data?.attributes?.request?.time ?? '',
                headers: data?.attributes?.request?.headers ?? {},
                body: data?.attributes?.request?.body ?? '',
                path: data?.attributes?.request?.path ?? '',
                query: data?.attributes?.request?.query ?? {},
                raw_query: data?.attributes?.request?.raw_query ?? '',
                method: data?.attributes?.request?.method ?? '',
                content_length: data?.attributes?.request?.content_length ?? 0,
            },
            response: {
                time: data?.attributes?.response?.time ?? '',
                body: data?.attributes?.response?.body ?? '',
                headers: data?.attributes?.response?.headers ?? {},
                status: data?.attributes?.response?.status ?? 0,
            },
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): Log {
        return new Log(data);
    }
}
