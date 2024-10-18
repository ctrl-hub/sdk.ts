import { ServiceAccountKey } from "../models/ServiceAccountKey";
import { BaseService } from "@services/BaseService";
export class ServiceAccountKeysService extends BaseService {
    constructor(client) {
        // Use the correct endpoint and the hydrate method for ServiceAccountKey
        super(client, "/v3/orgs/:orgId/admin/iam/service-accounts", ServiceAccountKey.hydrate);
    }
}
