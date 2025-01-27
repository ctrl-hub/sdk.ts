import { Client } from 'Client';
import { BaseService } from './BaseService';
import type { InternalResponse, JsonData } from '../types/Response';
import { Customer } from '@models/Customer';
import { CustomerInteraction } from '@models/CustomerInteraction';

export class CustomersService extends BaseService<Customer> {
    constructor(client: Client) {
        super(client, '/v3/orgs/:orgId/customers');
    }

    async interactions(id: string): Promise<InternalResponse<CustomerInteraction[]>> {
        const modelsEndpoint = `${this.endpoint}/${id}/interactions`;
        const resp = await this.client.makeGetRequest(modelsEndpoint);

        const hydratedData = this.hydrator.hydrateResponse<CustomerInteraction>(
            resp.data as JsonData | JsonData[],
            resp.included || [],
        );

        return {
            ...resp,
            data: hydratedData,
        } as InternalResponse<CustomerInteraction[]>;
    }
}
