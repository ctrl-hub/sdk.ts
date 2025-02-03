import { Client } from "Client";
import { BaseService } from "./BaseService";
import type { OperationTemplate } from "@models/OperationTemplate";
export declare class OperationTemplatesService extends BaseService<OperationTemplate> {
    constructor(client: Client);
}
