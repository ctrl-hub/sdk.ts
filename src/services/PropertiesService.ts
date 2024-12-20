import {Client} from "Client";
import {BaseService} from "./BaseService";
import {Equipment} from "../models/Equipment";
import type { InternalResponse } from '../types/Response';

export class PropertiesService extends BaseService<Equipment> {
    constructor(client: Client) {
        super(client, "/v3/governance/properties");
    }

    async byUprn(uprn: string): Promise<InternalResponse<Equipment>>;
    async byUprn(uprn: string[]): Promise<InternalResponse<Equipment[]>>;
    async byUprn(uprn: string|string[]): Promise<InternalResponse<Equipment | Equipment[]>> {
        // only 1 uprn, append directly to endpoint i.e. /properties/{uprn}
        if (!Array.isArray(uprn)) {
            return await this.client.makeGetRequest(`${this.endpoint}/${uprn}`);
        }

        // convert string/array of "uprns" to format: ?filter[uprn]=1&filter[uprn]=2
        const filter = '?' + uprn
            .map(value => `filter[uprn]=${encodeURIComponent(value)}`)
            .join('&');
        return await this.client.makeGetRequest(`${this.endpoint}${filter}`);
    }

}
