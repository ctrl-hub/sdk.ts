import { Client } from 'Client';
import { BaseService } from './BaseService';
import { CustomerInteraction } from '@models/CustomerInteraction';
export class CustomerInteractionsService extends BaseService {
    constructor(client, customerId) {
        const endpoint = customerId ? `/v3/orgs/:orgId/customers/${customerId}/interactions` : `/v3/orgs/:orgId/interactions`;
        super(client, endpoint);
    }
}
