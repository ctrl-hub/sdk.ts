import { BaseService } from "./BaseService";
export class EquipmentModelsService extends BaseService {
    constructor(client) {
        super(client, "/v3/assets/equipment/models");
    }
}
