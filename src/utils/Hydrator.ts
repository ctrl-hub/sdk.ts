import type { JsonData } from '../types/Response';
import type { Model } from '../types/Model';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { Equipment } from '@models/Equipment';
import { EquipmentCategory } from '@models/EquipmentCategory';
import { EquipmentExposure } from '@models/EquipmentExposure';
import { EquipmentModel } from '@models/EquipmentModel';
import { Form } from '@models/Form';
import { FormCategory } from '@models/FormCategory';
import { Group } from '@models/Group';
import { Permission } from '@models/Permission';
import { Role } from '@models/Role';
import { ServiceAccount } from '@models/ServiceAccount';
import { ServiceAccountKey } from '@models/ServiceAccountKey';
import { Submission } from '@models/Submission';
import { Vehicle } from '@models/Vehicle';
import { VehicleCategory } from '@models/VehicleCategory';
import { VehicleModel } from '@models/VehicleModel';
import { VehicleManufacturer } from '@models/VehicleManufacturer';
import { VehicleSpecification } from '@models/VehicleSpecification';
import { EquipmentManufacturer } from '@models/EquipmentManufacturer';
import { Property } from '@models/Property';
import { VehicleInventoryCheck } from '@models/VehicleInventoryCheck';
import { VehicleInspection } from '@models/VehicleInspection';
import { User } from '@models/User';
import { MotRecord } from '@models/MotRecord';
import { FormVersion } from '@models/FormVersion';
import { Contact } from '@models/Contact';
import { CustomerAccount } from '@models/CustomerAccount';
import { CustomerInteraction } from '@models/CustomerInteraction';
import { Team } from '@models/Team';
import { Scheme } from '@models/Scheme';
import { WorkOrder } from '@models/WorkOrder';
import { Operation } from '@models/Operation';
import { OperationTemplate } from '@models/OperationTemplate';
import { Street } from '@models/Street';
import { Appointment } from '@models/Appointment';

export class Hydrator {
    private modelMap: Record<string, new (data?: any) => Model> = {
        appointments: Appointment,
        contacts: Contact,
        "customer-accounts": CustomerAccount,
        'customer-interactions': CustomerInteraction,
        'equipment-categories': EquipmentCategory,
        'equipment-items': Equipment,
        'equipment-exposures': EquipmentExposure,
        'equipment-models': EquipmentModel,
        'equipment-manufacturers': EquipmentManufacturer,
        forms: Form,
        'form-categories': FormCategory,
        'form-versions': FormVersion,
        groups: Group,
        "operation-templates": OperationTemplate,
        operations: Operation,
        permissions: Permission,
        properties: Property,
        roles: Role,
        schemes: Scheme,
        'service-accounts': ServiceAccount,
        'service-account-keys': ServiceAccountKey,
        streets: Street,
        submissions: Submission,
        teams: Team,
        users: User,
        vehicles: Vehicle,
        'vehicle-categories': VehicleCategory,
        'vehicle-models': VehicleModel,
        'vehicle-manufacturers': VehicleManufacturer,
        'vehicle-specifications': VehicleSpecification,
        'vehicle-inventory-checks': VehicleInventoryCheck,
        'vehicle-inspections': VehicleInspection,
        'vehicle-mot-records': MotRecord,
        'work-orders': WorkOrder,
    };

    public getModelMap = () => {
        return this.modelMap;
    };

    hydrateResponse<T extends Model>(data: JsonData | JsonData[], included: any[]): T | T[] {
        return Array.isArray(data) ? this.hydrateArray<T>(data, included) : this.hydrateSingle<T>(data, included);
    }

    private hydrateArray<T extends Model>(items: JsonData[], included: any[]): T[] {
        return items.map(item => this.hydrateSingle<T>(item, included));
    }

    private hydrateSingle<T extends Model>(item: JsonData, included: any[]): T {
        const ModelClass = this.modelMap[item.type];
        if (!ModelClass) {
            throw new Error(`No model found for type: ${item.type}`);
        }

        const model = new ModelClass({
            id: item.id,
            type: item.type,
            meta: item.meta,
            links: item.links,
            attributes: item.attributes,
            relationships: item.relationships,
        }) as T;

        if (item.relationships) {
            this.hydrateRelationships(model, item.relationships, included, ModelClass);
        }

        return model;
    }

    private hydrateRelationships(
        model: Model,
        relationships: Record<string, any>,
        included: any[],
        ModelClass: new (data?: any) => Model,
    ): void {
        if (!('relationships' in ModelClass)) return;

        const relationshipDefs = (ModelClass as any).relationships as RelationshipDefinition[];
        if (!relationshipDefs) return;

        for (const relationDef of relationshipDefs) {
            const relationData = relationships[relationDef.name]?.data;
            if (!relationData) continue;

            if (relationDef.type === 'array') {
                (model as any)[relationDef.name] = Array.isArray(relationData)
                    ? relationData.map(relation => this.findAndHydrateIncluded(relation, included))
                    : [];
            } else {
                (model as any)[relationDef.name] = this.findAndHydrateIncluded(relationData, included);
            }
        }
    }

    private findAndHydrateIncluded(relation: { id: string; type: string }, included: any[]): Model | null {
        const includedData = included.find(inc => inc.id === relation.id && inc.type === relation.type);

        if (!includedData) return relation;

        return this.hydrateSingle(includedData, included);
    }
}
