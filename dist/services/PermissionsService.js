import { BaseService } from "../services/BaseService";
import { Permission } from "../models/Permission";
export class PermissionsService extends BaseService {
    constructor(client) {
        super(client, "/v3/admin/permissions", Permission.hydrate);
    }
}
