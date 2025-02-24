import { describe, it, expect } from "bun:test";
import { JsonApiSerializer } from "@utils/JsonSerializer";
import { Equipment } from "@models/Equipment";
import { FormCategory } from '@models/FormCategory';
import { Hydrator } from '@utils/Hydrator'

describe('JsonApiSerializer for Equipment and Model', () => {

    const hydrator = new Hydrator();

    describe('buildCreatePayload', () => {

        it('should transform a model whcih does not have jsonApiMapping', () => {
            const formCategory = new FormCategory();
            formCategory.name = "Test Category";

            const payload = (new JsonApiSerializer(hydrator.getModelMap())).buildCreatePayload(formCategory);

            const expectedPayload = {
                data: {
                    type: "form-categories",
                    attributes: {
                        name: "Test Category"
                    }
                }
            };

            expect(payload).toEqual(expectedPayload);
        });
    });
});