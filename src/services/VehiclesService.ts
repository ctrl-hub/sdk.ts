import {Client} from "Client";
import {BaseService} from "./BaseService";
import {Vehicle} from "../models/Vehicle";
import type { InternalResponse } from '../types/Response';
import { Hydrator } from "@utils/Hydrator";
import type { MotRecord } from "@models/MotRecord";

type JsonApiRelationshipsPayload = {
    data: {
        id: string,
        type: string,
       relationships: {
        equipment: {
            data: Array<{
                type: string;
                id: string;
                }>;
            }
        }
    }
};

export class VehiclesService extends BaseService<Vehicle> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/assets/vehicles");
    }

    async enquiry(registration: string): Promise<InternalResponse<any[]>> {
        const enquiryEndpoint = '/v3/assets/vehicles/enquiries';

        const body = {
            data: {
                type: 'vehicle-enquiries',
                attributes: {
                    registration
                }
            }
        }

        return await this.client.makePostRequest(enquiryEndpoint, body);
    }

    async motRecords(vehicleId: string): Promise<InternalResponse<MotRecord[]>> {
        const motRecordsEndpoint = `${this.endpoint}/${vehicleId}/mot-records`;
        const resp = await this.client.makeGetRequest(motRecordsEndpoint);

        const hydrator = new Hydrator();
        resp.data = hydrator.hydrateResponse(resp.data, resp.included)

        return resp;
    }

    public async patchEquipment(vehicleId: string, equipment: Array<string>) {
        const payload = this.buildEquipmentRelationshipPayload(vehicleId, equipment, 'equipment-items');
        payload.data.id = vehicleId;
        return await this.client.makePatchRequest(`${this.endpoint}/${vehicleId}`, payload);
    }

    buildEquipmentRelationshipPayload(vehicleId: string, relationships: Array<string>, relationshipType: string): JsonApiRelationshipsPayload {
        const data = relationships
            .filter(relationship => relationship !== undefined)
            .map(relationship => ({
                type: relationshipType,
                id: relationship,
            }));

        const payload: JsonApiRelationshipsPayload = {
            data: {
                id: vehicleId,
                type: 'vehicles',
                relationships: {
                    equipment: {
                        data: data
                        }
                    }
                }
            };

        return payload;
    }
}
