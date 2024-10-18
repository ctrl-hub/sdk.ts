import { ServiceAccount } from "../models/ServiceAccount";
import { BaseService } from "@services/BaseService";
export class ServiceAccountsService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/admin/iam/service-accounts", ServiceAccount.hydrate);
    }
}
