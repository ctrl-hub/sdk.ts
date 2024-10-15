export type ClientConfigInterface = {
    organisationId: string;
    baseDomain?: string;
    credentials: {
        client_id?: string;
        client_secret?: string;
        session_token?: string;
    };
};

export class ClientConfig {
    public organisationId: string;
    public baseDomain: string;
    public credentials: {
        client_id?: string;
        client_secret?: string;
        session_token?: string;
    };

    constructor(config: ClientConfigInterface) {
        this.organisationId = config.organisationId;
        this.baseDomain = config.baseDomain || 'https://app.ctrl-hub.com';
        this.credentials = config.credentials
    }
}