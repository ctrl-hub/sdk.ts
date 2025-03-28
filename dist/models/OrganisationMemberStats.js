import { BaseModel } from './BaseModel';
export class OrganisationMemberStats extends BaseModel {
    type = 'members-stats';
    members = {
        users: 0,
        service_accounts: 0
    };
    constructor(data) {
        super(data);
        this.members = data?.attributes?.members || {
            users: 0,
            members: 0
        };
    }
}
