import { Client } from "../Client";
import { BaseService } from "./BaseService";
export class VehicleStatusesService extends BaseService {
    constructor(client) {
        super(client, "/v3/assets/vehicles/statuses");
    }
}
