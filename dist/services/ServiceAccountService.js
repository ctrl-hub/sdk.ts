import { BaseService } from "../services/BaseService";
import { Log } from "../models/Log";
export class ServiceAccountsService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/iam/service-accounts");
    }
    async createKey(serviceAccount) {
        let createKeyEndpoint = this.client.finalEndpoint(this.endpoint + '/' + serviceAccount.id + '/keys');
        return await this.client.makePostRequest(createKeyEndpoint, {
            data: {
                type: 'service-account-keys'
            }
        });
    }
    ;
    async create(serviceAccount) {
        let createKeyEndpoint = this.client.finalEndpoint(this.endpoint);
        return await this.client.makePostRequest(createKeyEndpoint, {
            data: {
                type: serviceAccount.type,
                attributes: {
                    name: serviceAccount.attributes.name,
                    description: serviceAccount.attributes.description
                }
            }
        });
    }
    async logs(id) {
        const logsEndpoint = this.client.finalEndpoint(`${this.endpoint}/${id}/logs`);
        const resp = await this.client.makeGetRequest(logsEndpoint);
        resp.data = resp.data.map((log) => Log.hydrate(log));
        return resp;
    }
}
