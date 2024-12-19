import { Client } from '../Client';
import type { InternalResponse } from '../types/Response';
import type { RequestOptionsType } from '../utils/RequestOptions';
import { Hydrator } from '../utils/Hydrator';
import { RequestBuilder } from '../utils/RequestBuilder';
import type { Model } from '../types/Model';
export declare class BaseService<T extends Model> extends RequestBuilder {
    protected client: Client;
    protected endpoint: string;
    protected hydrator: Hydrator;
    constructor(client: Client, endpoint: string);
    get(): Promise<InternalResponse<T[]>>;
    get(param: string): Promise<InternalResponse<T>>;
    get(param: string, options?: RequestOptionsType): Promise<InternalResponse<T>>;
    get(param: RequestOptionsType): Promise<InternalResponse<T[]>>;
    create(model: Model): Promise<InternalResponse<T>>;
    update(id: string, model: Model): Promise<InternalResponse<T>>;
}
