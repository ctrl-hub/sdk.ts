import { Client } from 'Client';
import { BaseService } from './BaseService';
import { CustomerInteraction } from '@models/CustomerInteraction';
import { JsonApiSerializer } from '@utils/JsonSerializer';
export class CustomerInteractionsService extends BaseService {
    constructor(client) {
        super(client, '/v3/orgs/:orgId/customers');
    }
    async create(model, customerId) {
        const interactionEndpoint = `${this.endpoint}/${customerId}/interactions`;
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildCreatePayload(model);
        return await this.client.makePostRequest(interactionEndpoint, payload);
    }
    async update(id, model, customerId) {
        const interactionEndpoint = `${this.endpoint}/${customerId}/interactions/${id}`;
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildUpdatePayload(model);
        return await this.client.makePatchRequest(interactionEndpoint, payload);
    }
}
