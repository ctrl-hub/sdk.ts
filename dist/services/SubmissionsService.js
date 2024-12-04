import { BaseService } from "../services/BaseService";
import { Submission } from "../models/Submission";
import { SubmissionVersion } from "../models/SubmissionVersion";
export class SubmissionsService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/data-capture/submissions", Submission.hydrate);
    }
    async getVersions(submissionId) {
        const versionsEndpoint = this.client.finalEndpoint(`${this.endpoint}/${submissionId}/relationships/versions`);
        const resp = await this.client.makeGetRequest(versionsEndpoint);
        resp.data = resp.data.map((submissionVersion) => SubmissionVersion.hydrate(submissionVersion));
        return resp;
    }
    async getVersion(submissionId, versionId) {
        const versionEndpoint = this.client.finalEndpoint(`${this.endpoint}/${submissionId}/relationships/versions/${versionId}`);
        const resp = await this.client.makeGetRequest(versionEndpoint);
        resp.data = SubmissionVersion.hydrate(resp.data);
        return resp;
    }
}
