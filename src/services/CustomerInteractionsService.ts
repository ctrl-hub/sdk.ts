import { Client } from 'Client';
import { BaseService } from './BaseService';
import { CustomerInteraction } from '@models/CustomerInteraction';
import type { InternalResponse } from 'types/Response';
import { JsonApiSerializer } from '@utils/JsonSerializer';

export class CustomerInteractionsService extends BaseService<CustomerInteraction> {
    constructor(client: Client) {
        super(client, '/v3/orgs/:orgId/customers');
    }

    async create(model: CustomerInteraction, customerId: string): Promise<InternalResponse<CustomerInteraction>> {
        const enquiryEndpoint = `${this.endpoint}/${customerId}/interactions`;
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildCreatePayload(model);
        return await this.client.makePostRequest(enquiryEndpoint, payload);
    }
}
