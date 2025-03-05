import { Client } from "../Client";
import { BaseService } from "./BaseService";
import { VehicleInventoryCheck } from "../models/VehicleInventoryCheck";
export declare class VehicleInventoryCheckService extends BaseService<VehicleInventoryCheck> {
    constructor(client: Client);
}
