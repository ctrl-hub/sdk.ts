import { BaseService } from '../services/BaseService';
import { Client } from 'Client';
import type { User } from '@models/User';

export class OrganisationMembersService extends BaseService<User> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/iam/members");
    }
}
