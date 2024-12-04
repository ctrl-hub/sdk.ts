import { BaseService } from "./BaseService";
export class VehiclesService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/assets/vehicles");
    }
}
