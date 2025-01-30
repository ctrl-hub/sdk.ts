import { Client } from "Client";
import { BaseService } from "./BaseService";
import type { Operation } from "@models/Operation";
export declare class OperationsService extends BaseService<Operation> {
    constructor(client: Client, schemeId: string, workOrderId: string);
}
