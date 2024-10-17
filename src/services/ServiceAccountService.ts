import {Client} from "../Client";
import {BaseService} from "../services/BaseService";
import {ServiceAccount} from "../models/ServiceAccount"

export class ServiceAccountsService extends BaseService<ServiceAccount> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/admin/iam/service-accounts", ServiceAccount.hydrate);
    }

    async createKey(serviceAccount: ServiceAccount): Promise<any> {
        let createKeyEndpoint = this.client.finalEndpoint(this.endpoint + '/' + serviceAccount.id + '/keys');
        return await this.client.makePostRequest(createKeyEndpoint, {
            data: {
                type: 'service-account-keys'
            }
        });
    };

}