export type ClientConfigInterface = {
    organisationId: string;
    baseDomain: string;
    clientId?: string;
    clientSecret?: string;
    authUrl?: string;
};
export declare class ClientConfig {
    organisationId: string;
    baseDomain: string;
    clientId: string;
    clientSecret: string;
    authUrl: string;
    constructor(config: ClientConfigInterface);
}
