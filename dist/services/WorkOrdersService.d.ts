import { Client } from "Client";
import { BaseService } from "./BaseService";
import type { WorkOrder } from "@models/WorkOrder";
export declare class WorkOrdersService extends BaseService<WorkOrder> {
    constructor(client: Client, schemeId: string);
}
