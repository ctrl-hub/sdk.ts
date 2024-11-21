import { Client } from "Client";
import { BaseService } from "../services/BaseService";
import { Submission } from "../models/Submission";
import { InternalResponse } from "types/Response";
import { SubmissionVersion } from "@models/SubmissionVersion";
export declare class SubmissionsService extends BaseService<Submission> {
    constructor(client: Client);
    getVersions(submissionId: string): Promise<InternalResponse<SubmissionVersion[]>>;
    getVersion(submissionId: string, versionId: string): Promise<InternalResponse<SubmissionVersion>>;
}
