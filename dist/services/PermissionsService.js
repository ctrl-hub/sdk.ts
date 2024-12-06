import { BaseService } from "../services/BaseService";
import { Permission } from "../models/Permission";
import { Client } from "Client";
export class PermissionsService extends BaseService {
    constructor(client) {
        super(client, "/v3/iam/permissions");
    }
}
