import { Client } from "Client";
import { BaseService } from "@services/BaseService";
import { FormCategory } from "@models/FormCategory";
export declare class FormCategoriesService extends BaseService<FormCategory> {
    constructor(client: Client);
}
