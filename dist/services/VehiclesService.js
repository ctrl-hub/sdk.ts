import { Client } from "../Client";
import { BaseService } from "./BaseService";
import { Vehicle } from "../models/Vehicle";
import { User } from "../models/User";
import { Hydrator } from "../utils/Hydrator";
import { Equipment } from "../models/Equipment";
import { JsonApiSerializer } from "../utils/JsonSerializer";
export class VehiclesService extends BaseService {
    constructor(client, vehicleId) {
        const endpoint = vehicleId ? `/v3/orgs/:orgId/assets/vehicles/${vehicleId}` : `/v3/orgs/:orgId/assets/vehicles`;
        super(client, endpoint);
    }
    async enquiry(registration) {
        const enquiryEndpoint = '/v3/assets/vehicles/enquiries';
        const body = {
            data: {
                type: 'vehicle-enquiries',
                attributes: {
                    registration
                }
            }
        };
        return await this.client.makePostRequest(enquiryEndpoint, body);
    }
    async motRecords(vehicleId) {
        const motRecordsEndpoint = `${this.endpoint}/${vehicleId}/mot-records`;
        const resp = await this.client.makeGetRequest(motRecordsEndpoint);
        const hydrator = new Hydrator();
        resp.data = hydrator.hydrateResponse(resp.data, resp.included);
        return resp;
    }
    async patchEquipment(equipmentItems) {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildRelationshipPayload(new Equipment, equipmentItems);
        return await this.client.makePatchRequest(`${this.endpoint}/relationships/equipment`, payload);
    }
    async patchAssignee(user) {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildRelationshipPayload(new User, user);
        return await this.client.makePatchRequest(`${this.endpoint}/relationships/assignee`, payload);
    }
}
