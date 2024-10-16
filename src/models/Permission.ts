import type { Model } from "../types/Model";

type PermissionAttributes = {
  description: string;
};

export class Permission implements Model {
  public id: string = "";
  public type: string = "roles";
  public attributes: PermissionAttributes;
  public meta: any = {};
  links: any;

  constructor() {
    this.attributes = {
      description: "",
    };
  }

  static hydrate(data: any) {
    let permission = new Permission();

    if (data) {
      permission.id = data.id;
      permission.attributes.description = data.attributes.description || "";
      permission.meta = data.meta || {};
    }

    return permission;
  }
}
