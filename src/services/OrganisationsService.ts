import { BaseService } from '../services/BaseService';
import { Organisation } from '../models/Organisation';
import { Client } from 'Client';

export class OrganisationsService extends BaseService<Organisation> {
    constructor(client: Client) {
        super(client, "/v3/orgs");
    }
}
