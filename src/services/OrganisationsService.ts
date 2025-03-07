import {BaseService} from "../services/BaseService";
import {Organisation} from "../models/Organisation";
import {Client} from "Client";
import { User } from "@models/User";

export class OrganisationsService extends BaseService<Organisation> {
    constructor(client: Client) {
        super(client, "/v3/orgs");
    }

    public async getMembers() {
        const resp = await this.client.makeGetRequest(`${this.endpoint}/:orgId/iam/members`);

        resp.data = resp.data.map((modelData: any) => {
            return new User({
                ...modelData,
                included: []
            });
        });

        return resp;
    }
}
