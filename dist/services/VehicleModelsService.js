import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleModel } from "../models/VehicleModel";
export class VehicleModelsService extends BaseService {
    constructor(client) {
        super(client, "/v3/assets/vehicles/models");
    }
}
