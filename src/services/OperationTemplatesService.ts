import { Client } from "Client";
import { BaseService } from "./BaseService";
import type { OperationTemplate } from "@models/OperationTemplate";

export class OperationTemplatesService extends BaseService<OperationTemplate> {
    constructor(client: Client) {
        super(client, `/v3/orgs/:orgId/governance/operation-templates`);
    }
}
