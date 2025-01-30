import { Client } from "Client";
import { BaseService } from "./BaseService";
import type { WorkOrder } from "@models/WorkOrder";

export class WorkOrdersService extends BaseService<WorkOrder> {
    constructor(client: Client, schemeId: string) {
        super(client, `/v3/orgs/:orgId/governance/schemes/${schemeId}/work-orders`);
    }
}
