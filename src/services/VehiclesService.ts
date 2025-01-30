import {Client} from "Client";
import {BaseService} from "./BaseService";
import {Vehicle} from "../models/Vehicle";
import type { InternalResponse } from '../types/Response';
import { VehicleInventoryCheck } from "@models/VehicleInventoryCheck";
import { VehicleInspection } from "@models/VehicleInspection";
import { Hydrator } from "@utils/Hydrator";
import type { MotRecord } from "@models/MotRecord";

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

    async inventoryChecks(vehicleId: string): Promise<InternalResponse<VehicleInventoryCheck[]>> {
        const includes = '?include=author,equipment,equipment.model,equipment.model.categories,equipment.model.manufacturer';
        const inventoryChecksEndpoint = `${this.endpoint}/${vehicleId}/inventory-checks${includes}`;
        const resp = await this.client.makeGetRequest(inventoryChecksEndpoint);

        const hydrator = new Hydrator();
        resp.data = hydrator.hydrateResponse(resp.data, resp.included)

        return resp;
    }

    async inspectionsByOrganisation(): Promise<InternalResponse<VehicleInspection[]>> {
        const includes = '?include=author,vehicle';
        const inspectionsEndpoint = `${this.endpoint}/inspections${includes}`;
        const resp = await this.client.makeGetRequest(inspectionsEndpoint);

        const hydrator = new Hydrator();
        resp.data = hydrator.hydrateResponse(resp.data, resp.included)

        return resp;
    }

    async inspections(vehicleId: string): Promise<InternalResponse<VehicleInspection[]>> {
        const includes = '?include=author';
        const inspectionsEndpoint = `${this.endpoint}/${vehicleId}/inspections${includes}`;
        const resp = await this.client.makeGetRequest(inspectionsEndpoint);

        const hydrator = new Hydrator();
        resp.data = hydrator.hydrateResponse(resp.data, resp.included)

        return resp;
    }

    async inspection(vehicleId: string, inspectionId: string): Promise<InternalResponse<VehicleInspection[]>> {
        const includes = '?include=author';
        const inspectionsEndpoint = `${this.endpoint}/${vehicleId}/inspections/${inspectionId}${includes}`;
        const resp = await this.client.makeGetRequest(inspectionsEndpoint);

        const hydrator = new Hydrator();
        resp.data = hydrator.hydrateResponse(resp.data, resp.included)

        return resp;
    }

    async motRecords(vehicleId: string): Promise<InternalResponse<MotRecord[]>> {
        const motRecordsEndpoint = `${this.endpoint}/${vehicleId}/mot-records`;
        const resp = await this.client.makeGetRequest(motRecordsEndpoint);

        const hydrator = new Hydrator();
        resp.data = hydrator.hydrateResponse(resp.data, resp.included)

        return resp;
    }
}
