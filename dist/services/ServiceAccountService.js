import { Client } from "../Client";
import { BaseService } from "../services/BaseService";
import { ServiceAccount } from "../models/ServiceAccount";
import { Log } from "../models/Log";
export class ServiceAccountsService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/iam/service-accounts");
    }
    async createKey(serviceAccount) {
        let createKeyEndpoint = this.endpoint + '/' + serviceAccount.id + '/keys';
        return await this.client.makePostRequest(createKeyEndpoint, {
            data: {
                type: 'service-account-keys'
            }
        });
    }
    ;
    async logs(id) {
        const logsEndpoint = `${this.endpoint}/${id}/logs`;
        const resp = await this.client.makeGetRequest(logsEndpoint);
        resp.data = resp.data.map((log) => Log.hydrate(log));
        return resp;
    }
}
