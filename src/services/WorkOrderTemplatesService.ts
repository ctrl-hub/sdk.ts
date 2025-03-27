import { Client } from "Client";
import { BaseService } from "./BaseService";
import type { WorkOrderTemplate } from "@models/WorkOrderTemplate";

export class WorkOrderTemplatesService extends BaseService<WorkOrderTemplate> {
    constructor(client: Client) {
        super(client, `/v3/orgs/:orgId/governance/work-order-templates`);
    }
}
