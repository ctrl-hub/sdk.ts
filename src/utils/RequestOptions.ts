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
    include?: String[]
};

export class RequestOptions {
    sort?: Sort[];
    limit?: number;
    offset?: number;
    filters?: Filter[];
    include?: String[];

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
        if (options.include) {
            this.include = options.include
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

        if (this.include && this.include.length) {
            params.append('include', this.include.join(','));
        }

        if (this.limit) {
            params.append('limit', this.limit.toString());
        }

        if (this.offset) {
            params.append('offset', this.offset.toString());
        }

        return params;
    }

    static fromUrl(url: string, defaults: Partial<RequestOptionsType> = {}): RequestOptionsType {
        const urlObj = new URL(url);
        const queryParams = urlObj.searchParams;

        // Use defaults if query params are not present
        const requestOptions: RequestOptionsType = {
            filters: [],
            limit: parseInt(queryParams.get('limit') || defaults.limit?.toString() || '20'),
            offset: parseInt(queryParams.get('offset') || defaults.offset?.toString() || '0'),
            sort: defaults.sort || [],
            include: defaults.include || [],
        };

        // Extract filters from query string
        queryParams.forEach((value, key) => {
            if (key.startsWith('filter[') && key.endsWith(']')) {
                const filterKey = key.slice(7, -1); // Extract the part inside 'filter[]'
                requestOptions.filters!.push({ key: filterKey, value });
            }

            // Handle sort parameter
            if (key === 'sort') {
                requestOptions.sort = [
                    {
                        key: value.startsWith('-') ? value.slice(1) : value,
                        direction: value.startsWith('-') ? 'desc' : 'asc',
                    },
                ];
            }
        });

        // Use default filters if none are provided by the URL
        if (!requestOptions.filters || requestOptions.filters.length === 0 && defaults.filters) {
            requestOptions.filters = defaults.filters;
        }

        return requestOptions;
    }
}