export type Model = {
    id?: string;
    type: String;
    attributes: Record<string, any>;
    meta?: any;
    relationships?: any[],
    included?: any;
    links: any;
}