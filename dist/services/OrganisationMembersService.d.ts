import { BaseService } from '../services/BaseService';
import { Client } from '../Client';
import type { User } from '../models/User';
export declare class OrganisationMembersService extends BaseService<User> {
    constructor(client: Client);
}
