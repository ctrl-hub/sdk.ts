import { BaseService } from "./BaseService";
import { EquipmentModel } from "@models/EquipmentModel";
export class EquipmentManufacturersService extends BaseService {
    constructor(client) {
        super(client, "/v3/assets/equipment/manufacturers");
    }
    async models(id) {
        const modelsEndpoint = this.client.finalEndpoint(`${this.endpoint}/${id}/models`);
        const resp = await this.client.makeGetRequest(modelsEndpoint);
        resp.data = resp.data.map((model) => EquipmentModel.hydrate(model));
        return resp;
    }
}
