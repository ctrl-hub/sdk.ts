import { Client } from '../Client';
import { BaseService } from './BaseService';
import { Team } from '../models/Team';
import { User } from '../models/User';
export declare class TeamsService extends BaseService<Team> {
    constructor(client: Client, teamId?: string);
    patchMembers(users: Array<User>): Promise<any>;
}
