import { BaseService } from "./BaseService";
export class EquipmentService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/assets/equipment");
    }
}
