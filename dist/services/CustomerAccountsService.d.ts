import { Client } from 'Client';
import { BaseService } from './BaseService';
import { CustomerAccount } from '@models/CustomerAccount';
export declare class CustomerAccountsService extends BaseService<CustomerAccount> {
    constructor(client: Client);
}
