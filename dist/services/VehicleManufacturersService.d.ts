import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleManufacturer } from "../models/VehicleManufacturer";
import type { InternalResponse } from "types/Response";
import { VehicleModel } from "@models/VehicleModel";
export declare class VehicleManufacturersService extends BaseService<VehicleManufacturer> {
    constructor(client: Client);
    models(id: string): Promise<InternalResponse<VehicleModel[]>>;
}
