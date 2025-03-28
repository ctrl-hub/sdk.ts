import { BaseModel } from '@models/BaseModel';

type MembersStats = {
    users: number;
    service_accounts: number;
}

export class OrganisationMemberStats extends BaseModel {
    public type: string = 'members-stats';

    public members: MembersStats = {
        users: 0,
        service_accounts: 0
    }

    constructor(data?: any) {
        super(data);
        this.members = data?.attributes?.members || {
            users: 0,
            members: 0
        }
    }
}
