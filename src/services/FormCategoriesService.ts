import {Client} from "Client";
import {BaseService} from "../services/BaseService";
import {FormCategory} from "../models/FormCategory";

export class FormCategoriesService extends BaseService<FormCategory> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/data-capture/form-categories", FormCategory.hydrate);
    }
}