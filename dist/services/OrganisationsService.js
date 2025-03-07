import { BaseService } from '../services/BaseService';
import { Organisation } from '../models/Organisation';
import { Client } from '../Client';
export class OrganisationsService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs");
    }
}
