import { Client } from "Client";
import { BaseService } from "./BaseService";
import { Vehicle } from "../models/Vehicle";
export class VehicleInventoryChecksService extends BaseService {
    constructor(client) {
        super(client, "/v3/orgs/:orgId/assets/vehicles");
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
    async inventoryChecks(vehicleId) {
        const includes = '?include=author,equipment,equipment.model,equipment.model.categories,equipment.model.manufacturer';
        const inventoryChecksEndpoint = `${this.endpoint}/${vehicleId}/inventory-checks${includes}`;
        return await this.client.makeGetRequest(inventoryChecksEndpoint);
    }
}
