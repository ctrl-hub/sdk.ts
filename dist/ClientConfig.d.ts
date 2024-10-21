export type ClientConfigInterface = {
    organisationId: string;
    baseDomain: string;
    clientId?: string;
    clientSecret?: string;
    authDomain?: string;
};
export declare class ClientConfig {
    organisationId: string;
    baseDomain: string;
    clientId: string;
    clientSecret: string;
    authDomain: string;
    constructor(config: ClientConfigInterface);
}
