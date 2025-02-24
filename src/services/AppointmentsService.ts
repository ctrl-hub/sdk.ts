import { Client } from 'Client';
import { BaseService } from './BaseService';
import { Appointment } from '@models/Appointment';

export class AppointmentsService extends BaseService<Appointment> {
    constructor(client: Client) {
        super(client, '/v3/orgs/:orgId/appointments');
    }
}
