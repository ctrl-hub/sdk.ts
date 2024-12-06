import { Client } from "Client";
import { BaseService } from "./BaseService";
import { EquipmentModel } from "../models/EquipmentModel";

export class EquipmentModelsService extends BaseService<EquipmentModel> {
    constructor(client: Client) {
        super(client, "/v3/assets/equipment/models");
    }
}
