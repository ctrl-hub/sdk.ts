import { Client } from "../Client";
import { BaseService } from "./BaseService";
import type { VehicleStatus } from "../models/VehicleStatus";
export declare class VehicleStatusesService extends BaseService<VehicleStatus> {
    constructor(client: Client);
}
