import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleManufacturer } from "../models/VehicleManufacturer";
import type { InternalResponse } from "types/Response";
import { VehicleModel } from "@models/VehicleModel";

export class VehicleManufacturersService extends BaseService<VehicleManufacturer> {
    constructor(client: Client) {
        super(client, "/v3/assets/vehicles/manufacturers");
    }

    async models(manufacturerId: string): Promise<InternalResponse<VehicleModel[]>> {
        const modelsEndpoint = `${this.endpoint}/${manufacturerId}/models?include=categories`;
        const resp = await this.client.makeGetRequest(modelsEndpoint);

        resp.data = resp.data.map((modelData: any) => {
            return new VehicleModel({
                ...modelData,
                included: resp.included
            });
        });

        return resp;
    }
}
