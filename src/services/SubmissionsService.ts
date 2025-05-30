import {Client} from "Client";
import {BaseService} from "../services/BaseService";
import {Submission} from "../models/Submission";
import type { InternalResponse } from "types/Response";
import { SubmissionVersion } from "../models/SubmissionVersion";

export class SubmissionsService extends BaseService<Submission> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/data-capture/submissions");
    }

    async getVersions(submissionId: string): Promise<InternalResponse<SubmissionVersion[]>> {
        const versionsEndpoint = `${this.endpoint}/${submissionId}/relationships/versions`;
        const resp = await this.client.makeGetRequest(versionsEndpoint);
        resp.data = resp.data.map((submissionVersion: any) => new SubmissionVersion(submissionVersion));
        return resp;
    }

    async getVersion(submissionId: string, versionId: string): Promise<InternalResponse<SubmissionVersion>> {
        const versionEndpoint = `${this.endpoint}/${submissionId}/relationships/versions/${versionId}`;
        const resp = await this.client.makeGetRequest(versionEndpoint);
        resp.data = new SubmissionVersion(resp.data);
        return resp;
    }
}