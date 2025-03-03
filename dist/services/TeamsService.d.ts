import { Client } from '../Client';
import { BaseService } from './BaseService';
import { Team } from '../models/Team';
export declare class TeamsService extends BaseService<Team> {
    constructor(client: Client);
}
