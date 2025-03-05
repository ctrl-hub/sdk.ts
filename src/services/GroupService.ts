import {BaseService} from "../services/BaseService";
import {Client} from "Client";
import {Group} from "../models/Group";

export class GroupsService extends BaseService<Group> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/iam/groups");
    }
}
