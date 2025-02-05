import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleInspection } from "@models/VehicleInspection";
export declare class VehicleInspectionService extends BaseService<VehicleInspection> {
    constructor(client: Client);
}
