import { Client } from "../Client";
import { BaseService } from "./BaseService";
import type { WorkOrderTemplate } from "../models/WorkOrderTemplate";
export declare class WorkOrderTemplatesService extends BaseService<WorkOrderTemplate> {
    constructor(client: Client);
}
