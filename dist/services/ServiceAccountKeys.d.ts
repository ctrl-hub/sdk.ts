import { ServiceAccountKey } from "../models/ServiceAccountKey";
import { Client } from "@src/Client";
import { BaseService } from "@services/BaseService";
export declare class ServiceAccountKeysService extends BaseService<ServiceAccountKey> {
    constructor(client: Client);
}
