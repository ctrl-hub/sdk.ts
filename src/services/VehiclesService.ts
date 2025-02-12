import {Client} from "Client";
import {BaseService} from "./BaseService";
import {Vehicle} from "../models/Vehicle";
import type { InternalResponse } from '../types/Response';
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

    async motRecords(vehicleId: string): Promise<InternalResponse<MotRecord[]>> {
        const motRecordsEndpoint = `${this.endpoint}/${vehicleId}/mot-records`;
        const resp = await this.client.makeGetRequest(motRecordsEndpoint);

        const hydrator = new Hydrator();
        resp.data = hydrator.hydrateResponse(resp.data, resp.included)

        return resp;
    }
}
