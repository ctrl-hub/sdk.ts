import {Client} from "Client";
import {BaseService} from "../services/BaseService";
import {Role} from "../models/Role";

export class RolesService extends BaseService<Role> {
    constructor(client: Client) {
        super(client, "/v3/admin/iam/roles", Role.hydrate);
    }
}