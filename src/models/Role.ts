import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';

type RoleAttributes = {
  custom: boolean;
  name: string;
  description: string;
  launch_stage: string;
  permissions: string[];
};

@RegisterModel
export class Role implements Model {
  public id: string = "";
  public type: string = "roles";
  public attributes: RoleAttributes;
  public meta: any = {};
  links: any;

  constructor() {
    this.attributes = {
      custom: false,
      name: "",
      description: "",
      launch_stage: "",
      permissions: [],
    };
  }

  static hydrate(data: any) {
    let role = new Role();

    if (data) {
      role.id = data.id;
      role.attributes.custom = data.attributes.custom || false;
      role.attributes.name = data.attributes.name || "";
      role.attributes.description = data.attributes.description || "";
      role.attributes.launch_stage = data.attributes.launch_stage || "";
      role.attributes.permissions = data.attributes.permissions || [];
      role.meta = data.meta || {};
    }

    return role;
  }
}
