import {Client} from "Client";
import {BaseService} from "./BaseService";
import {Equipment} from "../models/Equipment";

export class EquipmentService extends BaseService<Equipment> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/assets/equipment");
    }
}
