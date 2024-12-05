import { BaseService } from "./BaseService";
export class VehicleModelsService extends BaseService {
    constructor(client) {
        super(client, "/v3/assets/vehicles/models");
    }
}
