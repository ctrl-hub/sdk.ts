import { RequestOptions } from "../utils/RequestOptions";
export class RequestBuilder {
    requestOptions = {};
    withIncludes(includes) {
        this.requestOptions.include = includes;
        return this;
    }
    withSort(sort) {
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
    withFilters(filters) {
        this.requestOptions.filters = filters;
        return this;
    }
    withPagination(limit, offset = 0) {
        this.requestOptions.limit = limit;
        this.requestOptions.offset = offset;
        return this;
    }
    withLimit(limit) {
        this.requestOptions.limit = limit;
        return this;
    }
    withOffset(offset) {
        this.requestOptions.offset = offset;
        return this;
    }
    buildRequestParams(endpoint, param, options) {
        let finalEndpoint = endpoint;
        let requestOptions;
        if (typeof param === 'string') {
            finalEndpoint = `${endpoint}/${param}`;
            requestOptions = new RequestOptions({
                ...this.requestOptions,
                ...options
            });
        }
        else if (typeof param === 'object' && param !== null) {
            requestOptions = new RequestOptions({
                ...this.requestOptions,
                ...param
            });
        }
        else if (Object.keys(this.requestOptions).length > 0) {
            requestOptions = new RequestOptions(this.requestOptions);
        }
        return { endpoint: finalEndpoint, requestOptions };
    }
    clearRequestOptions() {
        this.requestOptions = {};
    }
    getRequestOptions() {
        return this.requestOptions;
    }
}
