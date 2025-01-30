import { Client } from 'Client';
import { BaseService } from './BaseService';
import { Customer } from '@models/Customer';

export class CustomersService extends BaseService<Customer> {
    constructor(client: Client) {
        super(client, '/v3/orgs/:orgId/customers');
    }
}
