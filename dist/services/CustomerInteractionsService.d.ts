import { Client } from 'Client';
import { BaseService } from './BaseService';
import { CustomerInteraction } from '@models/CustomerInteraction';
export declare class CustomerInteractionsService extends BaseService<CustomerInteraction> {
    constructor(client: Client, customerId: string);
}
