import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

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

export class Log extends BaseModel {
    public type: string = 'logs';

    public actor: Actor;
    public duration: number;
    public request: Request;
    public response: Response;

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
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
    }

}
