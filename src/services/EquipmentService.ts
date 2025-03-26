import {Client} from "Client";
import {BaseService} from "./BaseService";
import {Equipment} from "../models/Equipment";
import {EquipmentExposure} from "../models/EquipmentExposure";
import type { InternalResponse } from '../types/Response';

export class EquipmentService extends BaseService<Equipment> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/assets/equipment");
    }

    public async getExposures(equipmentId: string): Promise<InternalResponse<EquipmentExposure[]>> {
        const exposuresEndpoint = `${this.endpoint}/${equipmentId}/exposures`;
        const resp = await this.client.makeGetRequest(exposuresEndpoint);
        resp.data = resp.data.map((equipmentExposure: any) => new EquipmentExposure(equipmentExposure));
        return resp;
    }
}
