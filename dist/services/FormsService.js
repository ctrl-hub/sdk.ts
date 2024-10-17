import { BaseService } from "@services/BaseService";
import { Form } from "@models/Form";
export class FormsService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/data-capture/forms", Form.hydrate);
    }
}
