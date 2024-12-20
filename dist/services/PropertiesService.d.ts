import { Client } from "Client";
import { BaseService } from "./BaseService";
import { Equipment } from "../models/Equipment";
import type { InternalResponse } from '../types/Response';
export declare class PropertiesService extends BaseService<Equipment> {
    constructor(client: Client);
    byUprn(uprn: string): Promise<InternalResponse<Equipment>>;
    byUprn(uprn: string[]): Promise<InternalResponse<Equipment[]>>;
}
