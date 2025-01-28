import { Client } from 'Client';
import { BaseService } from './BaseService';
import { CustomerInteraction } from '@models/CustomerInteraction';
import type { InternalResponse } from 'types/Response';
export declare class CustomerInteractionsService extends BaseService<CustomerInteraction> {
    constructor(client: Client);
    create(model: CustomerInteraction, customerId: string): Promise<InternalResponse<CustomerInteraction>>;
}
