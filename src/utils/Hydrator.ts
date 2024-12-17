import type { JsonData } from '../types/Response';
import type { Model } from '../types/Model';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { Equipment } from '@models/Equipment';
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
import { VehicleModel } from '@models/VehicleModel';
import { VehicleManufacturer } from '@models/VehicleManufacturer';
import { VehicleSpecification } from '@models/VehicleSpecification';

export class Hydrator {
    private modelMap: Record<string, new (data?: any) => Model> = {
        'equipment-items': Equipment,
        'equipment-models': EquipmentModel,
        'forms': Form,
        'form_categories': FormCategory,
        'groups': Group,
        'permissions': Permission,
        'roles': Role,
        'service-accounts': ServiceAccount,
        'service-account-keys': ServiceAccountKey,
        'submissions': Submission,
        'vehicles': Vehicle,
        'vehicle-models': VehicleModel,
        'vehicle-manufacturers': VehicleManufacturer,
        'vehicle-specifications': VehicleSpecification
    };

    hydrateResponse<T extends Model>(data: JsonData | JsonData[], included: any[]): T | T[] {
        return Array.isArray(data)
            ? this.hydrateArray<T>(data, included)
            : this.hydrateSingle<T>(data, included);
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
            relationships: item.relationships
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
        ModelClass: new (data?: any) => Model
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

    private findAndHydrateIncluded(relation: { id: string, type: string }, included: any[]): Model | null {
        const includedData = included.find(inc =>
            inc.id === relation.id && inc.type === relation.type
        );

        if (!includedData) return null;

        return this.hydrateSingle(includedData, included);
    }
}