import { Role } from "../models/Role";
import { BaseService } from "@services/BaseService";
export class RolesService extends BaseService {
    constructor(client) {
        // Use the correct endpoint and the hydrate method for Role
        super(client, "/v3/admin/iam/roles", Role.hydrate);
    }
}
