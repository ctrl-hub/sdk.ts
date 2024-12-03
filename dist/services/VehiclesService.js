import { BaseService } from "./BaseService";
import { Vehicle } from "../models/Vehicle";
export class VehiclesService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/assets/vehicles", Vehicle.hydrate);
    }
}
