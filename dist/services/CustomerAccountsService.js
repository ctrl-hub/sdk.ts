import { Client } from 'Client';
import { BaseService } from './BaseService';
import { CustomerAccount } from '@models/CustomerAccount';
export class CustomerAccountsService extends BaseService {
    constructor(client) {
        super(client, '/v3/orgs/:orgId/customer-accounts');
    }
}
