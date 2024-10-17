import { Client } from "../Client";
import { BaseService } from "../services/BaseService";
import { ServiceAccount } from "../models/ServiceAccount";
export declare class ServiceAccountsService extends BaseService<ServiceAccount> {
    constructor(client: Client);
    createKey(serviceAccount: ServiceAccount): Promise<any>;
}
