import { BaseService } from "./BaseService";
import { Equipment } from "../models/Equipment";
export class EquipmentService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/assets/equipment", Equipment.hydrate);
    }
}
