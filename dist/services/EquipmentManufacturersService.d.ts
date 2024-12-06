import { Client } from "Client";
import { BaseService } from "./BaseService";
import { EquipmentManufacturer } from "../models/EquipmentManufacturer";
import { InternalResponse } from "types/Response";
import { EquipmentModel } from "@models/EquipmentModel";
export declare class EquipmentManufacturersService extends BaseService<EquipmentManufacturer> {
    constructor(client: Client);
    models(id: string): Promise<InternalResponse<EquipmentModel[]>>;
}
