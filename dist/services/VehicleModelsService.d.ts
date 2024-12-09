import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleModel } from "../models/VehicleModel";
export declare class VehicleModelsService extends BaseService<VehicleModel> {
    constructor(client: Client);
}
