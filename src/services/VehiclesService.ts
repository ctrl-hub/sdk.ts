import {Client} from "Client";
import {BaseService} from "./BaseService";
import {Vehicle} from "../models/Vehicle";

export class VehiclesService extends BaseService<Vehicle> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/assets/vehicles");
    }
}
