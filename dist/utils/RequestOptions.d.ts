type Sort = {
    key: string;
    direction?: 'asc' | 'desc';
};
export type RequestOptionsType = {
    sort?: Sort[];
    limit?: number;
    offset?: number;
};
export declare class RequestOptions {
    sort?: Sort[];
    limit?: number;
    offset?: number;
    constructor(options: RequestOptionsType);
    toURLSearchParams(): URLSearchParams;
}
export {};
