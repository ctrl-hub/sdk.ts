import { Client } from "../Client";
import { BaseService } from "./BaseService";
import { Equipment } from "../models/Equipment";
export declare class EquipmentService extends BaseService<Equipment> {
    constructor(client: Client);
}
