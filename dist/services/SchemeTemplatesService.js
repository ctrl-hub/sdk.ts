import { Client } from "../Client";
import { BaseService } from "./BaseService";
export class SchemeTemplatesService extends BaseService {
    constructor(client) {
        super(client, `/v3/orgs/:orgId/governance/scheme-templates`);
    }
}
