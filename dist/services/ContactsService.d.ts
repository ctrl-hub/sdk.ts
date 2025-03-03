import { Client } from '../Client';
import { BaseService } from './BaseService';
import { Contact } from '../models/Contact';
export declare class ContactsService extends BaseService<Contact> {
    constructor(client: Client);
}
