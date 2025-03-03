import { Client } from "../Client";
import { BaseService } from "./BaseService";
import type { Street } from "../models/Street";
export declare class StreetsService extends BaseService<Street> {
    constructor(client: Client);
}
