import { Client } from '../Client';
import type { InternalResponse } from '../types/Response';
import type { RequestOptionsType } from '../utils/RequestOptions';
import { Hydrator } from '../utils/Hydrator';
import { RequestBuilder } from '../utils/RequestBuilder';
import type { Model } from '../types/Model';
import { JsonApiSerializer } from '@utils/JsonSerializer';
export declare class BaseService<T extends Model> extends RequestBuilder {
    protected client: Client;
    protected endpoint: string;
    protected hydrator: Hydrator;
    protected jsonApiSerializer: JsonApiSerializer;
    constructor(client: Client, endpoint: string);
    convertToJsonApi(model: Model): {
        data: {
            id?: string;
            type: string;
            attributes: Record<string, any>;
            relationships?: Record<string, {
                data: {
                    type: string;
                    id: string;
                };
            }>;
        };
    };
    get(): Promise<InternalResponse<T[]>>;
    get(param: string): Promise<InternalResponse<T>>;
    get(param: string, options?: RequestOptionsType): Promise<InternalResponse<T>>;
    get(param: RequestOptionsType): Promise<InternalResponse<T[]>>;
    create(model: T, params?: unknown): Promise<InternalResponse<T>>;
    update(id: string, model: Model, params?: unknown): Promise<InternalResponse<T>>;
}
