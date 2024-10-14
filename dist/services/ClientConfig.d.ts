export type ClientConfigInterface = {
    organisationId: string;
    baseDomain?: string;
};
export declare class ClientConfig {
    organisationId: string;
    baseDomain: string;
    constructor(config: ClientConfigInterface);
}
