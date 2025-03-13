import { Client } from '../Client';
import { BaseService } from './BaseService';
import { CustomerAccount } from '../models/CustomerAccount';
import { Property } from '../models/Property';
import { Contact } from '../models/Contact';
export declare class CustomerAccountsService extends BaseService<CustomerAccount> {
    constructor(client: Client, customerAccountId?: string);
    patchProperties(properties: Array<Property>): Promise<any>;
    patchContacts(contacts: Array<Contact>): Promise<any>;
}
