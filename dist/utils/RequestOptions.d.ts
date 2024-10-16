type Sort = {
    key: string;
    direction?: 'asc' | 'desc';
};
type Filter = {
    key: string;
    value: string;
};
export type RequestOptionsType = {
    sort?: Sort[];
    limit?: number;
    offset?: number;
    filters?: Filter[];
};
export declare class RequestOptions {
    sort?: Sort[];
    limit?: number;
    offset?: number;
    filters?: Filter[];
    constructor(options: RequestOptionsType);
    toURLSearchParams(): URLSearchParams;
}
export {};
