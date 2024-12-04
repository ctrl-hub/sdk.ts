import { BaseService } from "../services/BaseService";
export class RolesService extends BaseService {
    constructor(client) {
        super(client, "/v3/iam/roles");
    }
}
