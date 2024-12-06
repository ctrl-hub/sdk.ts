type Sort = {
    key: string;
    direction?: 'asc' | 'desc';
};
type Filter = {
    key: string;
    value: string;
};
export type SingleGetRequestOptionsType = {
    include?: String[];
};
export type RequestOptionsType = {
    sort?: Sort[];
    limit?: number;
    offset?: number;
    filters?: Filter[];
    include?: String[];
};
export declare class RequestOptions {
    sort?: Sort[];
    limit?: number;
    offset?: number;
    filters?: Filter[];
    include?: String[];
    constructor(options: RequestOptionsType);
    toURLSearchParams(): URLSearchParams;
    static fromUrl(url: string, defaults?: Partial<RequestOptionsType>): RequestOptionsType;
}
export {};
