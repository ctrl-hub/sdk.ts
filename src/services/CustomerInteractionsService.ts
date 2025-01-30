import { Client } from 'Client';
import { BaseService } from './BaseService';
import { CustomerInteraction } from '@models/CustomerInteraction';
import type { InternalResponse } from 'types/Response';
import { JsonApiSerializer } from '@utils/JsonSerializer';
import type { Model } from 'types/Model';

export class CustomerInteractionsService extends BaseService<CustomerInteraction> {
    constructor(client: Client) {
        super(client, '/v3/orgs/:orgId/customers');
    }

    async create(model: CustomerInteraction, customerId: string): Promise<InternalResponse<CustomerInteraction>> {
        const interactionEndpoint = `${this.endpoint}/${customerId}/interactions`;
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildCreatePayload(model);
        return await this.client.makePostRequest(interactionEndpoint, payload);
    }

    async update(id: string, model: Model, customerId: string): Promise<InternalResponse<CustomerInteraction>> {
        const interactionEndpoint = `${this.endpoint}/${customerId}/interactions/${id}`;
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildUpdatePayload(model);
        return await this.client.makePatchRequest(interactionEndpoint, payload);
    }
}
