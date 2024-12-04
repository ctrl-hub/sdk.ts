import { BaseService } from "../services/BaseService";
export class FormsService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/data-capture/forms");
    }
}
