import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleModel } from "../models/VehicleModel";

export class VehicleModelsService extends BaseService<VehicleModel> {
    constructor(client: Client) {
        super(client, "/v3/assets/vehicles/models");
    }
}
