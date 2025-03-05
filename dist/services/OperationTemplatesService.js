import { Client } from "../Client";
import { BaseService } from "./BaseService";
export class OperationTemplatesService extends BaseService {
    constructor(client) {
        super(client, `/v3/orgs/:orgId/governance/operation-templates`);
    }
}
