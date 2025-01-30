import { Client } from "Client";
import { BaseService } from "./BaseService";
import type { InternalResponse, JsonData } from "types/Response";
import type { Operation } from "@models/Operation";
import type { RequestOptionsType } from "@utils/RequestOptions";
import { JsonApiSerializer } from "@utils/JsonSerializer";

export class OperationsService extends BaseService<Operation> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/governance/schemes");
    }

    async get(): Promise<InternalResponse<Operation[]>>;
    async get(schemeId: string): Promise<InternalResponse<Operation>>;
    async get(schemeId: string, options?: RequestOptionsType): Promise<InternalResponse<Operation>>;
    async get(schemeId: RequestOptionsType): Promise<InternalResponse<Operation[]>>;
    async get(schemeId?: string | RequestOptionsType, options?: RequestOptionsType): Promise<InternalResponse<Operation | Operation[]>> {
        const workOrdersEndpoint = `${this.endpoint}/${schemeId}/work-orders`;
        const { endpoint, requestOptions } = this.buildRequestParams(workOrdersEndpoint, options);
        let resp = await this.client.makeGetRequest(endpoint, requestOptions);

        const hydratedData = this.hydrator.hydrateResponse<Operation>(resp.data as JsonData | JsonData[], resp.included || []);

        return {
            ...resp,
            data: hydratedData,
        } as InternalResponse<Operation | Operation[]>;
    }

    async create(model: Operation, schemeId: string): Promise<InternalResponse<Operation>> {
        const interactionEndpoint = `${this.endpoint}/${schemeId}/work-orders`;
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildCreatePayload(model);
        return await this.client.makePostRequest(interactionEndpoint, payload);
    }

    async update(id: string, model: Operation, schemeId: string): Promise<InternalResponse<Operation>> {
        const interactionEndpoint = `${this.endpoint}/${schemeId}/work-orders/${id}`;
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildUpdatePayload(model);
        return await this.client.makePatchRequest(interactionEndpoint, payload);
    }
}
