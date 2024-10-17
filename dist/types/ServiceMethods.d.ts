import {RequestOptionsType} from "../utils/RequestOptions";

export type ServiceMethods = {
    get: (param?: string | RequestOptionsType) => Promise<{ data: any[] }>;
    create: () => Promise<{ data: any[] }>;
}