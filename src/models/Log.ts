import type { Model } from "../types/Model";
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
    public relationships: any[];
    public links: any;

    constructor() {
        // Default initialization of attributes
        this.attributes = {
            actor: {
                type: '',
                id: ''
            },
            duration: 0,
            request: {
                time: '',
                headers: {},
                body: '',
                path: '',
                query: {},
                raw_query: '',
                method: '',
                content_length: 0,
            },
            response: {
                time: '',
                body: '',
                headers: {},
                status: 0,
            }
        };
        this.relationships = [];
        this.links = {};
    }

    // Static method to "hydrate" the Log object with data
    static hydrate(data: any) {
        let log = new Log();

        if (data) {
            log.id = data.id;
            log.attributes.actor = data.attributes.actor || { type: '', id: '' };
            log.attributes.duration = data.attributes.duration || 0;
            log.attributes.request = data.attributes.request || {
                time: '',
                headers: {},
                body: '',
                path: '',
                query: {},
                raw_query: '',
                method: '',
                content_length: 0
            };
            log.attributes.response = data.attributes.response || {
                time: '',
                body: '',
                headers: {},
                status: 0
            };
            log.meta = data.meta || {};
            log.links = data.links || {};
        }

        return log;
    }
}