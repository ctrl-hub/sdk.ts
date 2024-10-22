import { BaseService } from "../services/BaseService";
import { Group } from "../models/Group";
export class GroupsService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/admin/iam/groups", Group.hydrate);
    }
}
