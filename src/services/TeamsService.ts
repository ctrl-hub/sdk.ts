import { Client } from 'Client';
import { BaseService } from './BaseService';
import { Team } from '@models/Team';

export class TeamsService extends BaseService<Team> {
    constructor(client: Client) {
        super(client, '/v3/orgs/:orgId/people/teams');
    }
}
