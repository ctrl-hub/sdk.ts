import { Client } from "Client";
import { BaseService } from "@services/BaseService";
import { Submission } from "@models/Submission";
export declare class SubmissionsService extends BaseService<Submission> {
    constructor(client: Client);
}
