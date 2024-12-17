import { Client } from "../Client";
import { BaseService } from "../services/BaseService";
import { ServiceAccount } from "../models/ServiceAccount"
import { Log } from "../models/Log";
import type { InternalResponse } from "../types/Response";

export class ServiceAccountsService extends BaseService<ServiceAccount> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/iam/service-accounts");
    }

    async createKey(serviceAccount: ServiceAccount): Promise<any> {
        let createKeyEndpoint = this.endpoint + '/' + serviceAccount.id + '/keys';
        return await this.client.makePostRequest(createKeyEndpoint, {
            data: {
                type: 'service-account-keys'
            }
        });
    };

    async logs(id: string): Promise<InternalResponse<Log[]>> {
        const logsEndpoint = `${this.endpoint}/${id}/logs`;
        const resp = await this.client.makeGetRequest(logsEndpoint);
        resp.data = resp.data.map((log: any) => new Log(log));
        return resp;
    }

}