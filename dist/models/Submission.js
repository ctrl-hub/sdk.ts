import { BaseModel } from './BaseModel';
export class Submission extends BaseModel {
    type = 'submissions';
    reference = '';
    status = '';
    static relationships = [
        {
            name: 'form',
            type: 'single',
            modelType: 'forms'
        },
        {
            name: 'form_version',
            type: 'single',
            modelType: 'form-versions'
        },
    ];
    constructor(data) {
        super(data);
        this.reference = data?.attributes?.reference ?? '';
        this.status = data?.attributes?.status ?? '';
    }
}
