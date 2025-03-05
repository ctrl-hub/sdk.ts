import { Client } from "../Client";
import { BaseService } from "./BaseService";
export class OperationsService extends BaseService {
    constructor(client, schemeId, workOrderId) {
        super(client, `/v3/orgs/:orgId/governance/schemes/${schemeId}/work-orders/${workOrderId}/operations`);
    }
}
