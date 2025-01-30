import { Client } from "Client";
import { BaseService } from "./BaseService";
import type { Operation } from "@models/Operation";

export class OperationsService extends BaseService<Operation> {
    constructor(client: Client, schemeId: string, workOrderId: string) {
        super(client, `/v3/orgs/:orgId/governance/schemes/${schemeId}/work-orders/${workOrderId}/operations`);
    }
}
