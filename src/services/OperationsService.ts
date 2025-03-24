import { Client } from "Client";
import { BaseService } from "./BaseService";
import type { Operation } from "@models/Operation";
import { User } from "@models/User";
import { JsonApiSerializer } from "@utils/JsonSerializer";
import { Team } from "@models/Team";

export class OperationsService extends BaseService<Operation> {
    constructor(client: Client, schemeId: string, workOrderId: string, operationId?: string) {
        super(client, operationId ? `/v3/orgs/:orgId/governance/schemes/${schemeId}/work-orders/${workOrderId}/operations/${operationId}` : `/v3/orgs/:orgId/governance/schemes/${schemeId}/work-orders/${workOrderId}/operations`);
    }

    public async patchAssignees(users: Array<User>) {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildRelationshipPayload(new User, users);
        return await this.client.makePatchRequest(`${this.endpoint}/relationships/assignees`, payload);
    }

    public async patchTeams(teams: Array<Team>) {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildRelationshipPayload(new Team, teams);
        return await this.client.makePatchRequest(`${this.endpoint}/relationships/teams`, payload);
    }
}
