import {Client} from "Client";
import {BaseService} from "./BaseService";
import {EquipmentExposure} from "@models/EquipmentExposure";

export class EquipmentExposureService extends BaseService<EquipmentExposure> {
    constructor(client: Client, equipmentId?: string) {
        const endpoint = equipmentId? `/v3/orgs/:orgId/assets/equipment/${equipmentId}/exposures` : `/v3/orgs/:orgId/assets/equipment/exposures`;
        super(client, endpoint);
    }
}
