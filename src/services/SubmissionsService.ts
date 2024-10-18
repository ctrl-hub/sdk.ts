import {Client} from "Client";
import {BaseService} from "../services/BaseService";
import {Submission} from "../models/Submission";

export class SubmissionsService extends BaseService<Submission> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/data-capture/submissions", Submission.hydrate);
    }
}