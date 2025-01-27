import { Client } from 'Client';
import { BaseService } from './BaseService';
import type { InternalResponse } from '../types/Response';
import { Customer } from '@models/Customer';
import { CustomerInteraction } from '@models/CustomerInteraction';
import type { RequestOptionsType } from '@utils/RequestOptions';
export declare class CustomersService extends BaseService<Customer> {
    constructor(client: Client);
    interactions(param: string): Promise<InternalResponse<CustomerInteraction[]>>;
    interactions(param: string, options?: RequestOptionsType): Promise<InternalResponse<CustomerInteraction[]>>;
    interactions(param: RequestOptionsType): Promise<InternalResponse<CustomerInteraction[]>>;
}
