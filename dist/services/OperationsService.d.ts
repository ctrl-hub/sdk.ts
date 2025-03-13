import { Client } from "../Client";
import { BaseService } from "./BaseService";
import type { Operation } from "../models/Operation";
import { User } from "../models/User";
export declare class OperationsService extends BaseService<Operation> {
    constructor(client: Client, schemeId: string, workOrderId: string, operationId?: string);
    patchAssignees(users: Array<User>): Promise<any>;
}
