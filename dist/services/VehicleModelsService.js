import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleModel } from "../models/VehicleModel";
import { VehicleSpecification } from "@models/VehicleSpecification";
export class VehicleModelsService extends BaseService {
    constructor(client) {
        super(client, "/v3/assets/vehicles/models");
    }
    async specifications(id) {
        const modelsEndpoint = `${this.endpoint}/${id}/specifications`;
        const resp = await this.client.makeGetRequest(modelsEndpoint);
        resp.data = resp.data.map((model) => VehicleSpecification.hydrate(model));
        return resp;
    }
}
