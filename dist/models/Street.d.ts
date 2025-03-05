import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
type Location = {
    type: String;
    coordinates: Array<number>;
};
export declare class Street extends BaseModel {
    type: string;
    usrn: number;
    location: Location;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
export {};
