import { Client } from "../Client";
import { BaseService } from "../services/BaseService";
import { Role } from "../models/Role";
export class RolesService extends BaseService {
    constructor(client) {
        super(client, "/v3/iam/roles");
    }
}
