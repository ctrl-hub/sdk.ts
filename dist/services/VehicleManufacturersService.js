import { BaseService } from "./BaseService";
export class VehicleManufacturersService extends BaseService {
    constructor(client) {
        super(client, "/v3/vehicles/manufacturers");
    }
}
