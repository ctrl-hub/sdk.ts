import { Client } from 'Client';
import { BaseService } from './BaseService';
import { CustomerInteraction } from '@models/CustomerInteraction';

export class CustomerInteractionsService extends BaseService<CustomerInteraction> {
    constructor(client: Client, customerId: string) {
        super(client, `/v3/orgs/:orgId/customers/${customerId}/interactions`);
    }
}
