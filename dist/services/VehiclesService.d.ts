import { Client } from "Client";
import { BaseService } from "./BaseService";
import { Vehicle } from "../models/Vehicle";
export declare class VehiclesService extends BaseService<Vehicle> {
    constructor(client: Client);
}
