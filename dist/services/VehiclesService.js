import { Client } from "Client";
import { BaseService } from "./BaseService";
import { Vehicle } from "../models/Vehicle";
import { VehicleInventoryCheck } from "@models/VehicleInventoryCheck";
import { VehicleInspection } from "@models/VehicleInspection";
import { Hydrator } from "@utils/Hydrator";
export class VehiclesService extends BaseService {
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
        const resp = await this.client.makeGetRequest(inventoryChecksEndpoint);
        const hydrator = new Hydrator();
        resp.data = hydrator.hydrateResponse(resp.data, resp.included);
        return resp;
    }
    async inspectionsByOrganisation() {
        const includes = '?include=author,vehicle';
        const inspectionsEndpoint = `${this.endpoint}/inspections${includes}`;
        const resp = await this.client.makeGetRequest(inspectionsEndpoint);
        const hydrator = new Hydrator();
        resp.data = hydrator.hydrateResponse(resp.data, resp.included);
        return resp;
    }
    async inspections(vehicleId) {
        const includes = '?include=author';
        const inspectionsEndpoint = `${this.endpoint}/${vehicleId}/inspections${includes}`;
        const resp = await this.client.makeGetRequest(inspectionsEndpoint);
        const hydrator = new Hydrator();
        resp.data = hydrator.hydrateResponse(resp.data, resp.included);
        return resp;
    }
    async inspection(vehicleId, inspectionId) {
        const includes = '?include=author';
        const inspectionsEndpoint = `${this.endpoint}/${vehicleId}/inspections/${inspectionId}${includes}`;
        const resp = await this.client.makeGetRequest(inspectionsEndpoint);
        const hydrator = new Hydrator();
        resp.data = hydrator.hydrateResponse(resp.data, resp.included);
        return resp;
    }
    async motRecords(vehicleId) {
        const motRecordsEndpoint = `${this.endpoint}/${vehicleId}/mot-records`;
        const resp = await this.client.makeGetRequest(motRecordsEndpoint);
        const hydrator = new Hydrator();
        resp.data = hydrator.hydrateResponse(resp.data, resp.included);
        return resp;
    }
}
