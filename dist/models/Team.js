import { BaseModel } from '@models/BaseModel';
export class Team extends BaseModel {
    type = 'teams';
    name = '';
    jsonApiMapping() {
        return {
            attributes: ['name'],
            relationships: {
                members: 'users',
            },
        };
    }
    static relationships = [
        {
            name: 'members',
            type: 'array',
            modelType: 'users',
        },
    ];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
    }
}
