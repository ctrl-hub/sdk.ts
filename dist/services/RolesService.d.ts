import { Client } from "../Client";
import { BaseService } from "../services/BaseService";
import { Role } from "../models/Role";
export declare class RolesService extends BaseService<Role> {
    constructor(client: Client);
}
