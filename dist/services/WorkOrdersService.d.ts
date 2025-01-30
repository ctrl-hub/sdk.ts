import { Client } from "Client";
import { BaseService } from "./BaseService";
import type { InternalResponse } from "types/Response";
import type { WorkOrder } from "@models/WorkOrder";
import type { RequestOptionsType } from "@utils/RequestOptions";
export declare class WorkOrdersService extends BaseService<WorkOrder> {
    constructor(client: Client);
    get(): Promise<InternalResponse<WorkOrder[]>>;
    get(schemeId: string): Promise<InternalResponse<WorkOrder>>;
    get(schemeId: string, options?: RequestOptionsType): Promise<InternalResponse<WorkOrder>>;
    get(schemeId: RequestOptionsType): Promise<InternalResponse<WorkOrder[]>>;
    create(model: WorkOrder, schemeId: string): Promise<InternalResponse<WorkOrder>>;
    update(id: string, model: WorkOrder, schemeId: string): Promise<InternalResponse<WorkOrder>>;
}
