import { RequestOptions } from "../utils/RequestOptions";
import type { RequestOptionsType, SortDirection } from "../utils/RequestOptions";
export declare class RequestBuilder {
    protected requestOptions: RequestOptionsType;
    withIncludes(includes: string[]): this;
    withSort(sort: Array<{
        key: string;
        direction?: SortDirection;
    }>): this;
    withFilters(filters: Array<{
        key: string;
        value: string;
    }>): this;
    withPagination(limit: number, offset?: number): this;
    withLimit(limit: number): this;
    withOffset(offset: number): this;
    protected buildRequestParams(endpoint: string, param?: string | RequestOptionsType, options?: RequestOptionsType): {
        endpoint: string;
        requestOptions?: RequestOptions;
    };
    protected clearRequestOptions(): void;
    protected getRequestOptions(): RequestOptionsType;
}
