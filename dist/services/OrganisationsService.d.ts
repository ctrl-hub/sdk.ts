import { BaseService } from '../services/BaseService';
import { Organisation } from '../models/Organisation';
import { Client } from '../Client';
export declare class OrganisationsService extends BaseService<Organisation> {
    constructor(client: Client);
    getMembers(): Promise<import("../index").InternalResponse<any>>;
}
