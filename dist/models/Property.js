import { BaseModel } from '@models/BaseModel';
export class Property extends BaseModel {
    type = 'properties';
    custom = false;
    name = '';
    description = '';
    launch_stage = '';
    permissions = [];
    static relationships = [];
    constructor(data) {
        super(data);
        this.custom = data?.attributes?.custom ?? false;
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.launch_stage = data?.attributes?.launch_stage ?? '';
        this.permissions = data?.attributes?.permissions ?? [];
    }
}