import { Client } from "../Client";
import { BaseService } from "../services/BaseService";
import { ServiceAccount } from "../models/ServiceAccount";
import { Log } from "../models/Log";
import { InternalResponse } from "../types/Response";
export declare class ServiceAccountsService extends BaseService<ServiceAccount> {
    constructor(client: Client);
    createKey(serviceAccount: ServiceAccount): Promise<any>;
    create(serviceAccount: ServiceAccount): Promise<any>;
    logs(id: string): Promise<InternalResponse<Log[]>>;
}
