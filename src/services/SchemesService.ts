import { Client } from "Client";
import { BaseService } from "./BaseService";
import { Scheme } from "../models/Scheme";

export class SchemesService extends BaseService<Scheme> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/governance/schemes");
    }
}
