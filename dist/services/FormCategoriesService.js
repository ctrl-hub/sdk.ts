import { BaseService } from "../services/BaseService";
export class FormCategoriesService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/data-capture/form-categories");
    }
}
