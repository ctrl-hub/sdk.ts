import { BaseService } from '../services/BaseService';
import { Organisation } from '../models/Organisation';
import { Client } from 'Client';

export class OrganisationsService extends BaseService<Organisation> {
    constructor(client: Client) {
        super(client, "/v3/orgs");
    }

    public async getMembers() {
        this.endpoint = this.endpoint + '/:orgId/iam/members';
        return await this.get();
    }
}
