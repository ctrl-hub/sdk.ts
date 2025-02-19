import { Client } from 'Client';
import { BaseService } from './BaseService';
import { CustomerInteraction } from '@models/CustomerInteraction';

export class CustomerInteractionsService extends BaseService<CustomerInteraction> {
    constructor(client: Client) {
        super(client, '/v3/orgs/:orgId/customer-interactions');
    }
}
