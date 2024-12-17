import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleModel } from "../models/VehicleModel";
import { VehicleSpecification } from "@models/VehicleSpecification";
export class VehicleModelsService extends BaseService {
    constructor(client) {
        super(client, "/v3/assets/vehicles/manufacturers");
    }
    async specifications(manufacturerId, modelId) {
        const modelsEndpoint = `${this.endpoint}/${manufacturerId}/models/${modelId}/specifications`;
        const resp = await this.client.makeGetRequest(modelsEndpoint);
        resp.data = resp.data.map((model) => new VehicleSpecification(model));
        return resp;
    }
}
