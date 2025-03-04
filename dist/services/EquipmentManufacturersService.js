import { Client } from "../Client";
import { BaseService } from "./BaseService";
import { EquipmentManufacturer } from "../models/EquipmentManufacturer";
import { EquipmentModel } from "../models/EquipmentModel";
export class EquipmentManufacturersService extends BaseService {
    constructor(client) {
        super(client, "/v3/assets/equipment/manufacturers");
    }
    async models(id) {
        const modelsEndpoint = `${this.endpoint}/${id}/models?include=categories`;
        const resp = await this.client.makeGetRequest(modelsEndpoint);
        resp.data = resp.data.map((modelData) => {
            return new EquipmentModel({
                ...modelData,
                included: resp.included
            });
        });
        return resp;
    }
}
