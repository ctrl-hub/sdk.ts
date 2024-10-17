import { Role } from "../models/Role";
import { Client } from "@src/Client";
import { BaseService } from "@services/BaseService";
export declare class RolesService extends BaseService<Role> {
    constructor(client: Client);
}
