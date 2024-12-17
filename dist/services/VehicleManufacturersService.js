import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleManufacturer } from "../models/VehicleManufacturer";
import { VehicleModel } from "@models/VehicleModel";
export class VehicleManufacturersService extends BaseService {
    constructor(client) {
        super(client, "/v3/assets/vehicles/manufacturers");
    }
    async models(manufacturerId) {
        const modelsEndpoint = `${this.endpoint}/${manufacturerId}/models`;
        const resp = await this.client.makeGetRequest(modelsEndpoint);
        resp.data = resp.data.map((model) => new VehicleModel(model));
        return resp;
    }
}
