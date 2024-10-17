import { BaseService } from "@services/BaseService";
import { ServiceAccountKey } from "@models/ServiceAccountKey";
import { Client } from "Client";
export declare class ServiceAccountKeysService extends BaseService<ServiceAccountKey> {
    constructor(client: Client);
}
