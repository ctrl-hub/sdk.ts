import { Client } from 'Client';
import { BaseService } from './BaseService';
import { CustomerAccount } from '@models/CustomerAccount';
import { JsonApiSerializer } from '@utils/JsonSerializer';
import { Property } from '@models/Property';
import { Contact } from '@models/Contact';
export class CustomerAccountsService extends BaseService {
    constructor(client, customerAccountId) {
        const endpoint = customerAccountId ? `/v3/orgs/:orgId/customer-accounts/${customerAccountId}` : `/v3/orgs/:orgId/customer-accounts`;
        super(client, endpoint);
    }
    async patchProperties(properties) {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildRelationshipPayload(new Property, properties);
        return await this.client.makePatchRequest(`${this.endpoint}/relationships/properties`, payload);
    }
    async patchContacts(contacts) {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildRelationshipPayload(new Contact, contacts);
        return await this.client.makePatchRequest(`${this.endpoint}/relationships/contacts`, payload);
    }
}
