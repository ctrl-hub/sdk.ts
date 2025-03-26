import { Client } from "../Client";
import { BaseService } from "./BaseService";
import { Equipment } from "../models/Equipment";
import { EquipmentExposure } from "../models/EquipmentExposure";
export class EquipmentService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/assets/equipment");
    }
    async getExposures(equipmentId) {
        const exposuresEndpoint = `${this.endpoint}/${equipmentId}/exposures`;
        const resp = await this.client.makeGetRequest(exposuresEndpoint);
        resp.data = resp.data.map((equipmentExposure) => new EquipmentExposure(equipmentExposure));
        return resp;
    }
}
