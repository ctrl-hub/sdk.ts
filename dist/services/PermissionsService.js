import { BaseService } from "../services/BaseService";
export class PermissionsService extends BaseService {
    constructor(client) {
        super(client, "/v3/iam/permissions");
    }
}
