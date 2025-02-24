import { Client } from 'Client';
import { BaseService } from './BaseService';
import { Appointment } from '@models/Appointment';
export declare class AppointmentsService extends BaseService<Appointment> {
    constructor(client: Client);
}
