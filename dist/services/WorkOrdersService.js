import { Client } from "../Client";
import { BaseService } from "./BaseService";
export class WorkOrdersService extends BaseService {
    constructor(client, schemeId) {
        super(client, `/v3/orgs/:orgId/governance/schemes/${schemeId}/work-orders`);
    }
}
