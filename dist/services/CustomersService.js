import { Client } from 'Client';
import { BaseService } from './BaseService';
import { Customer } from '@models/Customer';
export class CustomersService extends BaseService {
    constructor(client) {
        super(client, '/v3/orgs/:orgId/customers');
    }
}
