import { Client } from "Client";
import { BaseService } from "./BaseService";
import { EquipmentManufacturer } from "../models/EquipmentManufacturer";
import type { InternalResponse } from "types/Response";
import { EquipmentModel } from "@models/EquipmentModel";

export class EquipmentManufacturersService extends BaseService<EquipmentManufacturer> {
    constructor(client: Client) {
        super(client, "/v3/assets/equipment/manufacturers");
    }

    async models(id: string): Promise<InternalResponse<EquipmentModel[]>> {
        const modelsEndpoint = `${this.endpoint}/${id}/models`;
        const resp = await this.client.makeGetRequest(modelsEndpoint);
        resp.data = resp.data.map((model: any) => EquipmentModel.hydrate(model));
        return resp;
    }
}
