import { Client } from "Client";
import { BaseService } from "./BaseService";
import { VehicleManufacturer } from "../models/VehicleManufacturer";

export class VehicleManufacturersService extends BaseService<VehicleManufacturer> {
    constructor(client: Client) {
        super(client, "/v3/vehicles/manufacturers");
    }
}
