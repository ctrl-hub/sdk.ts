import { BaseService } from "../services/BaseService";
import { ServiceAccountKey } from "../models/ServiceAccountKey";
import { Client } from "Client";
export class ServiceAccountKeysService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/iam/service-accounts");
    }
}
