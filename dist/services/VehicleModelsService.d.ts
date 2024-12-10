import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleModel } from "../models/VehicleModel";
import { VehicleSpecification } from "@models/VehicleSpecification";
import type { InternalResponse } from "types/Response";
export declare class VehicleModelsService extends BaseService<VehicleModel> {
    constructor(client: Client);
    specifications(manufacturerId: string, modelId: string): Promise<InternalResponse<VehicleSpecification[]>>;
}
