import {BaseService} from "@services/BaseService";
import {Permission} from "@models/Permission";
import {Client} from "Client";

export class PermissionsService extends BaseService<Permission> {
    constructor(client: Client) {
        super(client, "/v3/admin/permissions", Permission.hydrate);
    }
}