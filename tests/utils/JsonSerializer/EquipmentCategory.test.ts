import { describe, it, expect } from "bun:test";
import { JsonApiSerializer } from "@utils/JsonSerializer";
import { Hydrator } from '@utils/Hydrator';
import { EquipmentCategory } from '../../../src';

describe('JsonApiSerializer for Equipment Category', () => {
    const hydrator = new Hydrator();

    describe('buildCreatePayload', () => {
        it('should transform equipment category to correct JSONAPI format', () => {
            const category = new EquipmentCategory();
            category.id = "cat-123";
            category.name = "Test Category";

            const payload = (new JsonApiSerializer(hydrator.getModelMap())).buildCreatePayload(category);

            const expectedPayload = {
                data: {
                    type: "equipment-categories",
                    attributes: {
                        name: "Test Category"
                    }
                }
            };

            expect(payload).toEqual(expectedPayload);
        });
    });
});
