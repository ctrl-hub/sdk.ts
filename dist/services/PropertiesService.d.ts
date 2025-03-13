import { Client } from "../Client";
import { BaseService } from "./BaseService";
import type { InternalResponse } from '../types/Response';
import type { Property } from "../models/Property";
export declare class PropertiesService extends BaseService<Property> {
    constructor(client: Client);
    byUprn(uprn: string): Promise<InternalResponse<Property>>;
    byUprn(uprn: string[]): Promise<InternalResponse<Property[]>>;
}
