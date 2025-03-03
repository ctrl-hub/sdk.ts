import { BaseService } from "../services/BaseService";
import { Form } from "../models/Form";
import { Client } from "../Client";
export declare class FormsService extends BaseService<Form> {
    constructor(client: Client);
}
