import {BaseService} from "../services/BaseService";
import {ServiceAccountKey} from "../models/ServiceAccountKey";
import {Client} from "Client";

export class ServiceAccountKeysService extends BaseService<ServiceAccountKey> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/admin/iam/service-accounts", ServiceAccountKey.hydrate);
    }
}