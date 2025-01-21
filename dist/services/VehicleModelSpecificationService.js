import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleSpecification } from "@models/VehicleSpecification";
export class VehicleModelSpecificationService extends BaseService {
    constructor(client) {
        super(client, "/v3/assets/vehicles/manufacturers");
    }
    create(model, params) {
        const { manufacturerId, modelId } = params;
        const endpoint = this.endpoint + `/${manufacturerId}/models/${modelId}/specifications`;
        return this.client.makePostRequest(endpoint, this.convertToJsonApi(model));
    }
}
