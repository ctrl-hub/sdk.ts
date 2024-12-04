import { BaseService } from "../services/BaseService";
export class GroupsService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/iam/groups");
    }
    async deleteBinding(groupId, bindingId) {
        let deleteEndpoint = this.client.finalEndpoint(this.endpoint + '/' + groupId + '/bindings/' + bindingId);
        return await this.client.makeDeleteRequest(deleteEndpoint);
    }
    async createBinding(groupId, body) {
        let createBindingEndpoint = this.client.finalEndpoint(this.endpoint + '/' + groupId + '/bindings');
        return await this.client.makePostRequest(createBindingEndpoint, {
            data: {
                type: 'bindings',
                attributes: JSON.parse(body)
            }
        });
    }
}
