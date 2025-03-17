import { Client } from "../Client";
import { BaseService } from "./BaseService";
import { Vehicle } from "../models/Vehicle";
import { User } from "../models/User";
import type { InternalResponse } from '../types/Response';
import type { MotRecord } from "../models/MotRecord";
import { Equipment } from "../models/Equipment";
export declare class VehiclesService extends BaseService<Vehicle> {
    constructor(client: Client, vehicleId?: string);
    enquiry(registration: string): Promise<InternalResponse<any[]>>;
    motRecords(vehicleId: string): Promise<InternalResponse<MotRecord[]>>;
<<<<<<< HEAD
    patchEquipment(equipmentItems: Array<Equipment>): Promise<any>;
=======
    patchAssignee(user: User): Promise<any>;
>>>>>>> main
}
