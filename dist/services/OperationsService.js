import { Client } from "Client";
import { BaseService } from "./BaseService";
import { JsonApiSerializer } from "@utils/JsonSerializer";
export class OperationsService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/governance/schemes");
    }
    async get(schemeId, options) {
        const workOrdersEndpoint = `${this.endpoint}/${schemeId}/work-orders`;
        const { endpoint, requestOptions } = this.buildRequestParams(workOrdersEndpoint, options);
        let resp = await this.client.makeGetRequest(endpoint, requestOptions);
        const hydratedData = this.hydrator.hydrateResponse(resp.data, resp.included || []);
        return {
            ...resp,
            data: hydratedData,
        };
    }
    async create(model, schemeId) {
        const interactionEndpoint = `${this.endpoint}/${schemeId}/work-orders`;
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildCreatePayload(model);
        return await this.client.makePostRequest(interactionEndpoint, payload);
    }
    async update(id, model, schemeId) {
        const interactionEndpoint = `${this.endpoint}/${schemeId}/work-orders/${id}`;
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildUpdatePayload(model);
        return await this.client.makePatchRequest(interactionEndpoint, payload);
    }
}
