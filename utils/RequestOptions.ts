type Sort = {
    key: string;
    direction?: 'asc' | 'desc';
};

export type RequestOptionsType = {
    sort?: Sort[];
};

export class RequestOptions {
    sort?: Sort[];

    constructor(options: RequestOptionsType) {
        if (options.sort) {
            this.sort = options.sort;
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

        return params;
    }
}