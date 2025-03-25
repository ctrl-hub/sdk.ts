import {RequestOptions} from "../utils/RequestOptions";
import type {RequestOptionsType, SortDirection} from "../utils/RequestOptions";

export class RequestBuilder {
    protected requestOptions: RequestOptionsType = {};

    withIncludes(includes: string[]): this {
        this.requestOptions.include = includes;
        return this;
    }

    withSort(sort: Array<{ key: string, direction?: SortDirection }>): this {
        this.requestOptions.sort = sort.map(sortOption => {

            if (sortOption.direction && sortOption.direction !== 'asc' && sortOption.direction !== 'desc') {
                throw new Error(`Sort direction must be either 'asc' or 'desc', got: ${sortOption.direction}`);
            }

            return {
                key: sortOption.key,
                direction: sortOption.direction
            };
        });
        return this;
    }

    withFilters(filters: Array<{ key: string, value: string }>): this {
        this.requestOptions.filters = filters;
        return this;
    }

    withPagination(limit: number, offset: number = 0): this {
        this.requestOptions.limit = limit;
        this.requestOptions.offset = offset;
        return this;
    }

    withLimit(limit: number): this {
        this.requestOptions.limit = limit;
        return this;
    }

    withOffset(offset: number): this {
        this.requestOptions.offset = offset;
        return this;
    }

    protected buildRequestParams(
        endpoint: string,
        param?: string | RequestOptionsType,
        options?: RequestOptionsType
    ): { endpoint: string; requestOptions?: RequestOptions } {
        let finalEndpoint = endpoint;
        let requestOptions: RequestOptions | undefined;

        if (typeof param === 'string') {
            finalEndpoint = `${endpoint}/${param}`;
            requestOptions = new RequestOptions({
                ...this.requestOptions,
                ...options
            });
        } else if (typeof param === 'object' && param !== null) {
            requestOptions = new RequestOptions({
                ...this.requestOptions,
                ...param
            });
        } else if (Object.keys(this.requestOptions).length > 0) {
            requestOptions = new RequestOptions(this.requestOptions);
        }

        return {endpoint: finalEndpoint, requestOptions};
    }

    protected clearRequestOptions(): void {
        this.requestOptions = {};
    }

    protected getRequestOptions(): RequestOptionsType {
        return this.requestOptions;
    }

}
