import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

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

@RegisterModel
export class Log implements Model {
    public id: string = '';
    public type: string = 'logs';
    public meta: any = {};
    public links: any = {};
    public _relationships?: any;
    public included?: any;

    public actor: Actor;
    public duration: number;
    public request: Request;
    public response: Response;

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        this.id = data?.id ?? '';

        this.actor = data?.attributes?.actor ?? { type: '', id: '' };
        this.duration = data?.attributes?.duration ?? 0;
        this.request = data?.attributes?.request ?? {
            time: '',
            headers: {},
            body: '',
            path: '',
            query: {},
            raw_query: '',
            method: '',
            content_length: 0
        };
        this.response = data?.attributes?.response ?? {
            time: '',
            body: '',
            headers: {},
            status: 0
        };

        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): Log {
        return new Log(data);
    }

    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
