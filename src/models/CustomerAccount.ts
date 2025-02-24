import { BaseModel } from '@models/BaseModel';
import { JsonApiRelationship } from '@decorators/JsonApi';
import type { Property } from '@models/Property';
import type { Contact } from '@models/Contact';
import type { CustomerInteraction } from '@models/CustomerInteraction';

export class CustomerAccount extends BaseModel {
    public type: string = 'customer-accounts';

    @JsonApiRelationship('properties')
    public properties?: Property[] = [];

    @JsonApiRelationship('contacts')
    public contacts?: Contact[] = [];

    @JsonApiRelationship('customer-interactions')
    public interactions?: CustomerInteraction[] = [];

    constructor(data?: any) {
        super(data);
    }

}
