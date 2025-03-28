import { BaseService } from '../services/BaseService';
import { Client } from '../Client';
import type { User } from '../models/User';
import type { InternalResponse } from '../types/Response';
import type { RequestOptionsType } from '../utils/RequestOptions';
type OrganisationMembersStats = {
    members: {
        users: number;
        service_accounts: number;
    };
};
export declare class OrganisationMembersService extends BaseService<User> {
    constructor(client: Client);
    stats<R = OrganisationMembersStats>(options?: RequestOptionsType): Promise<InternalResponse<R>>;
}
export {};
