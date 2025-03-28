import { BaseModel } from './BaseModel';
type MembersStats = {
    users: number;
    service_accounts: number;
};
export declare class OrganisationMemberStats extends BaseModel {
    type: string;
    members: MembersStats;
    constructor(data?: any);
}
export {};
