import {Client} from "../Client";
import {BaseService} from "../services/BaseService";
import {ServiceAccount} from "../models/ServiceAccount"
import {Log} from "../models/Log";
import {InternalResponse} from "../types/Response";

export class ServiceAccountsService extends BaseService<ServiceAccount> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/iam/service-accounts");
    }

    async createKey(serviceAccount: ServiceAccount): Promise<any> {
        let createKeyEndpoint = this.client.finalEndpoint(this.endpoint + '/' + serviceAccount.id + '/keys');
        return await this.client.makePostRequest(createKeyEndpoint, {
            data: {
                type: 'service-account-keys'
            }
        });
    };

    async create(serviceAccount: ServiceAccount) {
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

    async logs(id: string): Promise<InternalResponse<Log[]>> {
        const logsEndpoint = this.client.finalEndpoint(`${this.endpoint}/${id}/logs`);
        const resp = await this.client.makeGetRequest(logsEndpoint);
        resp.data = resp.data.map((log: any) => Log.hydrate(log));
        return resp;
    }

}