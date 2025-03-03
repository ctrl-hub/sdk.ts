import { BaseService } from "../services/BaseService";
import { Permission } from "../models/Permission";
import { Client } from "../Client";
export declare class PermissionsService extends BaseService<Permission> {
    constructor(client: Client);
}
