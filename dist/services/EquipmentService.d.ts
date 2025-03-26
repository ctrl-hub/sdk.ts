import { Client } from "../Client";
import { BaseService } from "./BaseService";
import { Equipment } from "../models/Equipment";
import { EquipmentExposure } from "../models/EquipmentExposure";
import type { InternalResponse } from '../types/Response';
export declare class EquipmentService extends BaseService<Equipment> {
    constructor(client: Client);
    getExposures(equipmentId: string): Promise<InternalResponse<EquipmentExposure[]>>;
}
