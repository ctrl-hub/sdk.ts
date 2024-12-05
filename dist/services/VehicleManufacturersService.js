import { BaseService } from "./BaseService";
import { VehicleModel } from "@models/VehicleModel";
export class VehicleManufacturersService extends BaseService {
    constructor(client) {
        super(client, "/v3/assets/vehicles/manufacturers");
    }
    async models(id) {
        const modelsEndpoint = this.client.finalEndpoint(`${this.endpoint}/${id}/models`);
        const resp = await this.client.makeGetRequest(modelsEndpoint);
        resp.data = resp.data.map((model) => VehicleModel.hydrate(model));
        return resp;
    }
}
