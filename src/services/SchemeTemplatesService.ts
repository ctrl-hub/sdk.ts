import { Client } from "Client";
import { BaseService } from "./BaseService";
import type { SchemeTemplate } from "@models/SchemeTemplate";

export class SchemeTemplatesService extends BaseService<SchemeTemplate> {
    constructor(client: Client) {
        super(client, `/v3/orgs/:orgId/governance/scheme-templates`);
    }
}
