import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
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
export declare class Log extends BaseModel {
    type: string;
    actor: Actor;
    duration: number;
    request: Request;
    response: Response;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): Log;
}
export {};
