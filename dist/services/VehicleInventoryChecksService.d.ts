import { Client } from "Client";
import { BaseService } from "./BaseService";
import { Vehicle } from "../models/Vehicle";
import type { InternalResponse } from '../types/Response';
export declare class VehicleInventoryChecksService extends BaseService<Vehicle> {
    constructor(client: Client);
    enquiry(registration: string): Promise<InternalResponse<any[]>>;
    inventoryChecks(vehicleId: string): Promise<InternalResponse<any[]>>;
}
