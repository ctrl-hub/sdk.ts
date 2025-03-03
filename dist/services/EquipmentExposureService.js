import { Client } from "../Client";
import { BaseService } from "./BaseService";
import { EquipmentExposure } from "../models/EquipmentExposure";
export class EquipmentExposureService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/assets/equipment/exposures");
    }
}
