import { Client } from 'Client';
import { BaseService } from './BaseService';
import { Customer } from '@models/Customer';
import { CustomerInteraction } from '@models/CustomerInteraction';
export class CustomersService extends BaseService {
    constructor(client) {
        super(client, '/v3/orgs/:orgId/customers');
    }
    async interactions(param, options) {
        const interactionsEndpoint = `${this.endpoint}/${param}/interactions`;
        const { endpoint, requestOptions } = this.buildRequestParams(interactionsEndpoint, options);
        let resp = await this.client.makeGetRequest(endpoint, requestOptions);
        const hydratedData = this.hydrator.hydrateResponse(resp.data, resp.included || []);
        return {
            ...resp,
            data: hydratedData,
        };
    }
}
