import { Client } from "../Client";
import { BaseService } from "./BaseService";
export class StreetsService extends BaseService {
    constructor(client) {
        super(client, "/v3/governance/streets");
    }
}
