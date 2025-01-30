import { Client } from "Client";
import { BaseService } from "./BaseService";
import type { InternalResponse } from "types/Response";
import type { Operation } from "@models/Operation";
import type { RequestOptionsType } from "@utils/RequestOptions";
export declare class OperationsService extends BaseService<Operation> {
    constructor(client: Client);
    get(): Promise<InternalResponse<Operation[]>>;
    get(schemeId: string): Promise<InternalResponse<Operation>>;
    get(schemeId: string, options?: RequestOptionsType): Promise<InternalResponse<Operation>>;
    get(schemeId: RequestOptionsType): Promise<InternalResponse<Operation[]>>;
    create(model: Operation, schemeId: string): Promise<InternalResponse<Operation>>;
    update(id: string, model: Operation, schemeId: string): Promise<InternalResponse<Operation>>;
}
