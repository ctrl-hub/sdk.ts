export type ClientConfigInterface = {
    organisationId: string;
    baseDomain?: string;
};

export class ClientConfig {
    public organisationId: string;
    public baseDomain: string;

    constructor(config: ClientConfigInterface) {
        this.organisationId = config.organisationId;
        this.baseDomain = config.baseDomain || 'https://app.ctrl-hub.com';
    }
}