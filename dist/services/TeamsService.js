import { Client } from '../Client';
import { BaseService } from './BaseService';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { JsonApiSerializer } from '../utils/JsonSerializer';
export class TeamsService extends BaseService {
    constructor(client, teamId) {
        super(client, teamId ? `/v3/orgs/:orgId/people/teams/${teamId}` : '/v3/orgs/:orgId/people/teams');
    }
    async patchMembers(users) {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildRelationshipPayload(new User, users);
        return await this.client.makePatchRequest(`${this.endpoint}/relationships/members`, payload);
    }
}
