import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleManufacturer } from "../models/VehicleManufacturer";
import type { InternalResponse } from "types/Response";
import { VehicleModel } from "@models/VehicleModel";

export class VehicleManufacturersService extends BaseService<VehicleManufacturer> {
    constructor(client: Client) {
        super(client, "/v3/assets/vehicles/manufacturers");
    }

    async models(id: string): Promise<InternalResponse<VehicleModel[]>> {
        const modelsEndpoint = `${this.endpoint}/${id}/models`;
        const resp = await this.client.makeGetRequest(modelsEndpoint);
        resp.data = resp.data.map((model: any) => VehicleModel.hydrate(model));
        return resp;
    }
}
