import { BaseService } from "../services/BaseService";
import { Client } from "Client";
import { Group } from "../models/Group";
export declare class GroupsService extends BaseService<Group> {
    constructor(client: Client);
}
