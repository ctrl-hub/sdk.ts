import {Client} from "Client";
import { Property } from "../models/Property";

export class PropertiesService {

    private client: Client;
    private baseEndpoint: string;
    private finalEndpoint: string;

    constructor(client: Client) {
        this.baseEndpoint = '/v3/governance/properties';
        this.client = client;
        this.finalEndpoint = this.client.finalEndpoint(this.baseEndpoint);
    }

    private getMultipleProperties = async (uprns: string[]) => {
        const filterQuery = uprns.map(uprn => `filter[uprn]=${encodeURIComponent(uprn)}`).join('&');
        return await this.client.makeGetRequest(`${this.finalEndpoint}?${filterQuery}`);
    }

    private getSingleProperty = async (uprn: string) => {
        const url = this.client.finalEndpoint(this.baseEndpoint);
        return await this.client.makeGetRequest(url, uprn);
    }

    async get(uprns: string | string[]) {
        return Array.isArray(uprns) ? this.getMultipleProperties(uprns) : this.getSingleProperty(uprns);
    }

}