import { Client } from "../Client";
import { BaseService } from "./BaseService";
export class WorkOrderTemplatesService extends BaseService {
    constructor(client) {
        super(client, `/v3/orgs/:orgId/governance/work-order-templates`);
    }
}
