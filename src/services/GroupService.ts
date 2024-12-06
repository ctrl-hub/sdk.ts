import {BaseService} from "../services/BaseService";
import {Client} from "Client";
import {Group} from "../models/Group";

export class GroupsService extends BaseService<Group> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/iam/groups");
    }

    async deleteBinding(groupId: string, bindingId: string) {
        let deleteEndpoint = this.endpoint + '/' + groupId + '/bindings/' + bindingId;
        return await this.client.makeDeleteRequest(deleteEndpoint);
    }

    async createBinding(groupId: string, body: string) {
        let createBindingEndpoint = this.endpoint + '/' + groupId + '/bindings';
        return await this.client.makePostRequest(createBindingEndpoint, {
            data: {
                type: 'bindings',
                attributes: JSON.parse(body)
            }
        });
    }
}