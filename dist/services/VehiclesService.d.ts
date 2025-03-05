import { Client } from "Client";
import { BaseService } from "./BaseService";
import { Vehicle } from "../models/Vehicle";
import type { InternalResponse } from '../types/Response';
import type { MotRecord } from "@models/MotRecord";
type JsonApiRelationshipsPayload = {
    data: {
        id: string;
        type: string;
        relationships: {
            equipment: {
                data: Array<{
                    type: string;
                    id: string;
                }>;
            };
        };
    };
};
export declare class VehiclesService extends BaseService<Vehicle> {
    constructor(client: Client);
    enquiry(registration: string): Promise<InternalResponse<any[]>>;
    motRecords(vehicleId: string): Promise<InternalResponse<MotRecord[]>>;
    patchEquipment(vehicleId: string, equipment: Array<string>): Promise<any>;
    buildEquipmentRelationshipPayload(vehicleId: string, relationships: Array<string>, relationshipType: string): JsonApiRelationshipsPayload;
}
export {};
