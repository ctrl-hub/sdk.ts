import { Client } from 'Client';
import { BaseService } from './BaseService';
import { Customer } from '@models/Customer';
export declare class CustomersService extends BaseService<Customer> {
    constructor(client: Client);
}
