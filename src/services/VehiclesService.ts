import {Client} from "Client";
import {BaseService} from "./BaseService";
import {Vehicle} from "../models/Vehicle";
import {User} from "../models/User";
import type { InternalResponse } from '../types/Response';
import { Hydrator } from "@utils/Hydrator";
import type { MotRecord } from "@models/MotRecord";
import { Equipment } from "@models/Equipment";
import { JsonApiSerializer } from "@utils/JsonSerializer";

export class VehiclesService extends BaseService<Vehicle> {
    constructor(client: Client, vehicleId?: string) {
        const endpoint = vehicleId ? `/v3/orgs/:orgId/assets/vehicles/${vehicleId}` : `/v3/orgs/:orgId/assets/vehicles`;
        super(client, endpoint);
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

    public async patchEquipment(equipmentItems: Array<Equipment>) {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildRelationshipPayload(new Equipment, equipmentItems);
        return await this.client.makePatchRequest(`${this.endpoint}/relationships/equipment`, payload);
    }


    public async patchAssignee(user: User) {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildRelationshipPayload(new User, user);
        return await this.client.makePatchRequest(`${this.endpoint}/relationships/assignee`, payload);
    }
}
