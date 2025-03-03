import { Client } from "../Client";
import { BaseService } from "./BaseService";
import { EquipmentModel } from "../models/EquipmentModel";
export class EquipmentModelsService extends BaseService {
    constructor(client) {
        super(client, "/v3/assets/equipment/models");
    }
}
