import { Client } from "../Client";
import { BaseService } from "./BaseService";
import { User } from "../models/User";
import { JsonApiSerializer } from "../utils/JsonSerializer";
import { Team } from "../models/Team";
export class OperationsService extends BaseService {
    constructor(client, schemeId, workOrderId, operationId) {
        super(client, operationId ? `/v3/orgs/:orgId/governance/schemes/${schemeId}/work-orders/${workOrderId}/operations/${operationId}` : `/v3/orgs/:orgId/governance/schemes/${schemeId}/work-orders/${workOrderId}/operations`);
    }
    async patchAssignees(users) {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildRelationshipPayload(new User, users);
        return await this.client.makePatchRequest(`${this.endpoint}/relationships/assignees`, payload);
    }
    async patchTeams(teams) {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildRelationshipPayload(new Team, teams);
        return await this.client.makePatchRequest(`${this.endpoint}/relationships/teams`, payload);
    }
}
