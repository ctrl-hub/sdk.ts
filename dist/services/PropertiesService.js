import { Client } from "Client";
import { BaseService } from "./BaseService";
import { Equipment } from "../models/Equipment";
export class PropertiesService extends BaseService {
    constructor(client) {
        super(client, "/v3/governance/properties");
    }
    async byUprn(uprn) {
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
