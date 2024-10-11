import {ModelConstructor} from "./ModelConstructorInterface";

export type ServiceInterface = {
    endpoint: String;
    model: ModelConstructor<any>;
}