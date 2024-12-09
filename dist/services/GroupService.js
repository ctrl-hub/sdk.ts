import { BaseService } from "../services/BaseService";
import { Client } from "Client";
import { Group } from "../models/Group";
export class GroupsService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/iam/groups");
    }
    async deleteBinding(groupId, bindingId) {
        let deleteEndpoint = this.endpoint + '/' + groupId + '/bindings/' + bindingId;
        return await this.client.makeDeleteRequest(deleteEndpoint);
    }
    async createBinding(groupId, body) {
        let createBindingEndpoint = this.endpoint + '/' + groupId + '/bindings';
        return await this.client.makePostRequest(createBindingEndpoint, {
            data: {
                type: 'bindings',
                attributes: JSON.parse(body)
            }
        });
    }
}
