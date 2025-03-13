import {BaseService} from "../services/BaseService";
import {Client} from "Client";
import {Group} from "../models/Group";
import { User } from "@models/User";
import { JsonApiSerializer } from '@utils/JsonSerializer';

export class GroupsService extends BaseService<Group> {
    constructor(client: Client, groupId?: string) {
        const endpoint = groupId ? `/v3/orgs/:orgId/iam/groups/${groupId}` : `/v3/orgs/:orgId/iam/groups`;
        super(client, endpoint);
    }

    public async patchMembers(users: Array<User>) {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildRelationshipPayload(new User, users);
        return await this.client.makePatchRequest(`${this.endpoint}/relationships/members`, payload);
    }
}
