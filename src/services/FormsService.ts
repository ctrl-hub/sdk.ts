import {BaseService} from "../services/BaseService";
import {Form} from "../models/Form";
import {Client} from "Client";

export class FormsService extends BaseService<Form> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/data-capture/forms");
    }
}