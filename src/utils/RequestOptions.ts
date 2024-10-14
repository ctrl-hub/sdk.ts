type Sort = {
    key: string;
    direction?: 'asc' | 'desc';
};

export type RequestOptionsType = {
    sort?: Sort[];
    limit?: number;
    offset?: number;
};

export class RequestOptions {
    sort?: Sort[];
    limit?: number;
    offset?: number;

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
    }

    toURLSearchParams(): URLSearchParams {
        let params = new URLSearchParams();

        if (this.sort && this.sort.length) {
            let sortString = this.sort.map(sort => {
                return (sort.direction === 'desc' ? '-' : '') + sort.key;
            }).join(',');

            params.append('sort', sortString);
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