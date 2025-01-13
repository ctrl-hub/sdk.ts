import {Client} from "Client";
import {BaseService} from "./BaseService";
import {Vehicle} from "../models/Vehicle";
import type { InternalResponse } from '../types/Response';

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
}
