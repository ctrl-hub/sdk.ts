import { Client } from "Client";
export declare class PropertiesService {
    private client;
    private baseEndpoint;
    private finalEndpoint;
    constructor(client: Client);
    private getMultipleProperties;
    private getSingleProperty;
    get(uprns: string | string[]): Promise<import("../index").InternalResponse<any>>;
}
