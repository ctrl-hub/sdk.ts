import {Client} from "Client";
import {BaseService} from "./BaseService";
import type { Street } from "@models/Street";

export class StreetsService extends BaseService<Street> {
    constructor(client: Client) {
        super(client, "/v3/governance/streets");
    }
}
