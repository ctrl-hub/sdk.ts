import { Client } from 'Client';
import { BaseService } from './BaseService';
import type { InternalResponse, JsonData } from '../types/Response';
import { Customer } from '@models/Customer';
import { CustomerInteraction } from '@models/CustomerInteraction';
import type { RequestOptionsType } from '@utils/RequestOptions';

export class CustomersService extends BaseService<Customer> {
    constructor(client: Client) {
        super(client, '/v3/orgs/:orgId/customers');
    }

    async interactions(param: string): Promise<InternalResponse<CustomerInteraction[]>>;
    async interactions(param: string, options?: RequestOptionsType): Promise<InternalResponse<CustomerInteraction[]>>;
    async interactions(param: RequestOptionsType): Promise<InternalResponse<CustomerInteraction[]>>;
    async interactions(
        param?: string | RequestOptionsType,
        options?: RequestOptionsType,
    ): Promise<InternalResponse<CustomerInteraction[]>> {
        const interactionsEndpoint = `${this.endpoint}/${param}/interactions`;
        const { endpoint, requestOptions } = this.buildRequestParams(interactionsEndpoint, options);
        let resp = await this.client.makeGetRequest(endpoint, requestOptions);

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
