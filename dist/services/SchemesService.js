import { Client } from "Client";
import { BaseService } from "./BaseService";
import { Scheme } from "../models/Scheme";
export class SchemesService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/governance/schemes");
    }
}
