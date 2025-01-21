import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleSpecification } from "@models/VehicleSpecification";
import type { InternalResponse } from "types/Response";
interface CreateParams {
    manufacturerId: string;
    modelId: string;
}
export declare class VehicleModelSpecificationService extends BaseService<VehicleSpecification> {
    constructor(client: Client);
    create(model: VehicleSpecification, params: CreateParams): Promise<InternalResponse<VehicleSpecification>>;
}
export {};
