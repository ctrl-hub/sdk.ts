import { Equipment } from '@models/Equipment';
import { EquipmentCategory } from '@models/EquipmentCategory';
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
import { User } from '@models/User';
import { MotRecord } from '@models/MotRecord';
import { VehicleStatus } from '@models/VehicleStatus';
import { FormVersion } from '@models/FormVersion';
import { Customer } from '@models/Customer';
import { CustomerInteraction } from '@models/CustomerInteraction';
import { Team } from '@models/Team';
export class Hydrator {
    modelMap = {
        customers: Customer,
        'customer-interactions': CustomerInteraction,
        'equipment-categories': EquipmentCategory,
        'equipment-items': Equipment,
        'equipment-models': EquipmentModel,
        'equipment-manufacturers': EquipmentManufacturer,
        forms: Form,
        'form-categories': FormCategory,
        'form-versions': FormVersion,
        groups: Group,
        permissions: Permission,
        properties: Property,
        roles: Role,
        'service-accounts': ServiceAccount,
        'service-account-keys': ServiceAccountKey,
        submissions: Submission,
        teams: Team,
        users: User,
        vehicles: Vehicle,
        'vehicle-categories': VehicleCategory,
        'vehicle-models': VehicleModel,
        'vehicle-manufacturers': VehicleManufacturer,
        'vehicle-specifications': VehicleSpecification,
        'vehicle-inventory-checks': VehicleInventoryCheck,
        'vehicle-mot-records': MotRecord,
        'vehicle-statuses': VehicleStatus,
    };
    getModelMap = () => {
        return this.modelMap;
    };
    hydrateResponse(data, included) {
        return Array.isArray(data) ? this.hydrateArray(data, included) : this.hydrateSingle(data, included);
    }
    hydrateArray(items, included) {
        return items.map(item => this.hydrateSingle(item, included));
    }
    hydrateSingle(item, included) {
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
        });
        if (item.relationships) {
            console.log('relationships exist');
            console.log('relationships included', included);
            this.hydrateRelationships(model, item.relationships, included, ModelClass);
        }
        return model;
    }
    hydrateRelationships(model, relationships, included, ModelClass) {
        if (!('relationships' in ModelClass))
            return;
        const relationshipDefs = ModelClass.relationships;
        if (!relationshipDefs)
            return;
        for (const relationDef of relationshipDefs) {
            const relationData = relationships[relationDef.name]?.data;
            if (!relationData)
                continue;
            if (relationDef.type === 'array') {
                model[relationDef.name] = Array.isArray(relationData)
                    ? relationData.map(relation => this.findAndHydrateIncluded(relation, included))
                    : [];
            }
            else {
                model[relationDef.name] = this.findAndHydrateIncluded(relationData, included);
            }
        }
    }
    findAndHydrateIncluded(relation, included) {
        const includedData = included.find(inc => inc.id === relation.id && inc.type === relation.type);
        if (!includedData)
            return null;
        return this.hydrateSingle(includedData, included);
    }
}
