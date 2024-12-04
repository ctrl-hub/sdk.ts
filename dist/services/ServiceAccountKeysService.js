import { BaseService } from "../services/BaseService";
export class ServiceAccountKeysService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/iam/service-accounts");
    }
}
