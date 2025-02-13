import { Client } from 'Client';
import { BaseService } from './BaseService';
import { CustomerAccount } from '@models/CustomerAccount';

export class CustomerAccountsService extends BaseService<CustomerAccount> {
    constructor(client: Client) {
        super(client, '/v3/orgs/:orgId/customer-accounts');
    }
}
