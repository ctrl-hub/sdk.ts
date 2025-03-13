import { BaseService } from "../services/BaseService";
import { Client } from "../Client";
import { Group } from "../models/Group";
import { User } from "../models/User";
export declare class GroupsService extends BaseService<Group> {
    constructor(client: Client, groupId?: string);
    patchMembers(users: Array<User>): Promise<any>;
}
