import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleInventoryCheck } from "@models/VehicleInventoryCheck";
export class VehicleInventoryCheckService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/assets/vehicles/inventory-checks");
    }
}
