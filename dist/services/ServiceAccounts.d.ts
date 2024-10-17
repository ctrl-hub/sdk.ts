import { ServiceAccount } from "../models/ServiceAccount";
import { Client } from "@src/Client";
import { BaseService } from "@services/BaseService";
export declare class ServiceAccountsService extends BaseService<ServiceAccount> {
    constructor(client: Client);
}
