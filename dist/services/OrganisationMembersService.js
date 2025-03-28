import { BaseService } from '../services/BaseService';
import { Client } from '../Client';
export class OrganisationMembersService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/iam/members");
    }
    stats(options) {
        return super.stats(options);
    }
}
