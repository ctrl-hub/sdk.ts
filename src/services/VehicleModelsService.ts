import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleModel } from "../models/VehicleModel";
import { VehicleSpecification } from "@models/VehicleSpecification";
import type { InternalResponse } from "types/Response";

export class VehicleModelsService extends BaseService<VehicleModel> {
    constructor(client: Client) {
        super(client, "/v3/assets/vehicles/models");
    }

    async specifications(id: string): Promise<InternalResponse<VehicleSpecification[]>> {
        const modelsEndpoint = `${this.endpoint}/${id}/specifications`;
        const resp = await this.client.makeGetRequest(modelsEndpoint);
        resp.data = resp.data.map((model: any) => VehicleSpecification.hydrate(model));
        return resp;
    }
}
