import {Client} from "Client";
import {BaseService} from "./BaseService";
import type { VehicleStatus } from "@models/VehicleStatus";

export class VehicleStatusesService extends BaseService<VehicleStatus> {
    constructor(client: Client) {
        super(client, "/v3/assets/vehicles/statuses");
    }
}
