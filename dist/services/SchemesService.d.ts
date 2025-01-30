import { Client } from "Client";
import { BaseService } from "./BaseService";
import { Scheme } from "../models/Scheme";
export declare class SchemesService extends BaseService<Scheme> {
    constructor(client: Client);
}
