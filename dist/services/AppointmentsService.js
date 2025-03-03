import { Client } from '../Client';
import { BaseService } from './BaseService';
import { Appointment } from '../models/Appointment';
export class AppointmentsService extends BaseService {
    constructor(client) {
        super(client, '/v3/orgs/:orgId/appointments');
    }
}
