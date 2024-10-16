type Sort = {
    key: string;
    direction?: 'asc' | 'desc';
};

type Filter = {
    key: string,
    value: string,
}

export type RequestOptionsType = {
    sort?: Sort[];
    limit?: number;
    offset?: number;
    filters?: Filter[];
};

export class RequestOptions {
    sort?: Sort[];
    limit?: number;
    offset?: number;
    filters?: Filter[];

    constructor(options: RequestOptionsType) {
        if (options.sort) {
            this.sort = options.sort;
        }
        if (options.limit) {
            this.limit = options.limit
        }
        if (options.offset) {
            this.offset = options.offset
        }
        if (options.filters) {
            this.filters = options.filters
        }
    }

    toURLSearchParams(): URLSearchParams {
        let params = new URLSearchParams();

        if (this.sort && this.sort.length) {
            let sortString = this.sort.map(sort => {
                return (sort.direction === 'desc' ? '-' : '') + sort.key;
            }).join(',');

            params.append('sort', sortString);
        }

        if (this.filters && this.filters.length) {
            this.filters.forEach(filter => {
                params.append(`filter[${filter.key}]`, filter.value);
            });
        }

        if (this.limit) {
            params.append('limit', this.limit.toString());
        }

        if (this.offset) {
            params.append('offset', this.offset.toString());
        }

        return params;
    }
}