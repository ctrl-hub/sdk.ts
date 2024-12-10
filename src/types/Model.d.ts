export type Model<TAttributes = Record<string, any>, TRelationships = any> = {
    id?: string;
    type: String;
    attributes: TAttributes;
    meta: any;
    relationships?: TRelationships,
    included?: any;
    links: any;
}
