import { Client } from 'Client';
import { BaseService } from './BaseService';
import { Contact } from '@models/Contact';
export class ContactsService extends BaseService {
    constructor(client) {
        super(client, '/v3/orgs/:orgId/contacts');
    }
}
