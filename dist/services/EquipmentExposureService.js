import { Client } from "../Client";
import { BaseService } from "./BaseService";
import { EquipmentExposure } from "../models/EquipmentExposure";
export class EquipmentExposureService extends BaseService {
    constructor(client, equipmentId) {
        const endpoint = equipmentId ? `/v3/orgs/:orgId/assets/equipment/${equipmentId}/exposures` : `/v3/orgs/:orgId/assets/equipment/exposures`;
        super(client, endpoint);
    }
}
