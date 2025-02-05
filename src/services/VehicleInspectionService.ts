import {Client} from "Client";
import {BaseService} from "./BaseService";
import {VehicleInspection} from "@models/VehicleInspection";

export class VehicleInspectionService extends BaseService<VehicleInspection> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/assets/vehicles/inspections");
    }
}
