import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

type Location = {
    type: String;
    coordinates: Array<number>;
}

export class Street extends BaseModel {
    public type: string = 'streets';

    public usrn: number = 0;
    public location: Location = { type: '', coordinates: [] };

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.usrn = data?.attributes?.usrn ?? data.usrn ?? 0;
        this.location = data?.attributes?.location ?? data.location ?? { type: '', coordinates: [] };
    }

}
