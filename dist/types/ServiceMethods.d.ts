import {RequestOptionsType} from "../utils/RequestOptions";
import {InternalResponse} from "../types/Response";

export type ServiceMethods = {
    get: (param?: string | RequestOptionsType) => Promise<InternalResponse>;
    create: () => Promise<{ data: any[] }>;
}