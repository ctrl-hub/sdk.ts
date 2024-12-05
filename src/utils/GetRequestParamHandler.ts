import { RequestOptions, RequestOptionsType, SingleGetRequestOptionsType } from "./RequestOptions";

/**
 * No parameters = get all
 * string = get single
 * object = get all with filters
 * string + object = get single with filters
 */
export class GetRequestParamHandler {
    static handle(endpoint: string, param?: string | RequestOptionsType, singleGetRequestOptions?: SingleGetRequestOptionsType) {
        let requestParam: string | RequestOptions | undefined;

        if (typeof param === 'string') {
            requestParam = singleGetRequestOptions
                ? new RequestOptions(singleGetRequestOptions)
                : param;

            // single get e.g. get single vehicle, but can have ?include=x,y,z
            if (singleGetRequestOptions) {
                endpoint += `/${param}`;
            }
        } else if (typeof param === 'object') {
            requestParam = new RequestOptions(param);
        }

        return { requestParam, endpoint: endpoint };
    }
}