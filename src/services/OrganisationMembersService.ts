import { BaseService } from '../services/BaseService';
import { Client } from 'Client';
import type { User } from '@models/User';
import type { InternalResponse } from 'types/Response';
import type { RequestOptionsType } from '@utils/RequestOptions';

type OrganisationMembersStats = {
    members: {
        users: number,
        service_accounts: number
    }
}

export class OrganisationMembersService extends BaseService<User> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/iam/members");
    }

    override stats<R = OrganisationMembersStats>(options?: RequestOptionsType): Promise<InternalResponse<R>> {
        return super.stats<R>(options);
    }
}
