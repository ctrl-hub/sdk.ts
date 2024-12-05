import { Client } from "../Client";
import { InternalResponse } from "../types/Response";
import { RequestOptionsType } from "../utils/RequestOptions";
import { ModelRegistry } from "../utils/ModelRegistry";
import { Hydrator } from "../utils/Hydrator";
import { Model } from "types/Model";
export declare class BaseService<T> {
    protected client: Client;
    protected endpoint: string;
    protected modelRegistry: ModelRegistry;
    protected hydrator: Hydrator;
    constructor(client: Client, endpoint: string);
    get(): Promise<InternalResponse<T[]>>;
    get(param: string): Promise<InternalResponse<T>>;
    get(param: RequestOptionsType): Promise<InternalResponse<T[]>>;
    create(model: Model): Promise<any>;
}
