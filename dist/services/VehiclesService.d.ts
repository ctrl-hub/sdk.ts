import { Client } from "Client";
import { BaseService } from "./BaseService";
import { Vehicle } from "../models/Vehicle";
import type { InternalResponse } from '../types/Response';
import { VehicleInventoryCheck } from "@models/VehicleInventoryCheck";
import type { MotRecord } from "@models/MotRecord";
export declare class VehiclesService extends BaseService<Vehicle> {
    constructor(client: Client);
    enquiry(registration: string): Promise<InternalResponse<any[]>>;
    inventoryChecks(vehicleId: string): Promise<InternalResponse<VehicleInventoryCheck[]>>;
    motRecords(vehicleId: string): Promise<InternalResponse<MotRecord[]>>;
}
