import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleSpecification } from "@models/VehicleSpecification";
import type { InternalResponse } from "types/Response";

interface CreateParams {
    manufacturerId: string;
    modelId: string;
}

export class VehicleModelSpecificationService extends BaseService<VehicleSpecification> {
    constructor(client: Client) {
        super(client, "/v3/assets/vehicles/manufacturers");
    }

    override create(model: VehicleSpecification, params: CreateParams): Promise<InternalResponse<VehicleSpecification>> {
        const { manufacturerId, modelId } = params;
        const endpoint = this.endpoint + `/${manufacturerId}/models/${modelId}/specifications`;
        return this.client.makePostRequest(endpoint, this.convertToJsonApi(model));
    }
}
