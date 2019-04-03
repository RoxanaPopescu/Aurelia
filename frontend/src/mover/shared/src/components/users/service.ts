import Base from "shared/src/services/base";
import User, { Role } from "shared/src/model/profile/user";
import Localization from "../../localization";
import { ClaimGroup } from "../../model/profile/user";

export default class UserManagementService {
  /*
  ** API call to get users
  */
  static async getUsers() {
    let response = await fetch(
      Base.url("users/byOutfit"),
      Base.defaultConfig({})
    );

    let responseJson = await response.json();

    try {
      return responseJson.map(user => {
        return new User(user);
      });
    } catch {
      if (response.status === 400) {
        throw new Error(Localization.sharedValue("Users_UsersNotFound"));
      } else {
        throw new Error(Localization.sharedValue("Error_General"));
      }
    }
  }

  /*
  ** API call to get a specific user
  */
  static async getUser(id: string) {
    let response = await fetch(
      Base.url("users/details"),
      Base.defaultConfig({ userId: id })
    );

    let responseJson = await response.json();

    try {
      return new User(responseJson);
    } catch {
      if (response.status === 400) {
        throw new Error(Localization.sharedValue("Users_UserNotFound"));
      } else {
        throw new Error(Localization.sharedValue("Error_General"));
      }
    }
  }

  /*
  ** API call to create a user
  */
  static async createUser(
    firstName: string,
    lastName: string,
    email: string,
    outfitId: string,
    roleId: string
  ) {
    var items = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      outfitId: outfitId,
      roleId: roleId
    };

    let response = await fetch(
      Base.url("createUser"),
      Base.defaultConfig(items)
    );

    try {
      if (response.status === 409) {
        throw new Error(
          Localization.sharedValue("CreateUser_UserAlreadyExists")
        );
      } else if (response.status === 402) {
        throw new Error(
          Localization.sharedValue("CreateUser_OutfitDoesNotExist")
        );
      }

      return;
    } catch {
      if (response.status === 409) {
        throw new Error(
          Localization.sharedValue("CreateUser_UserAlreadyExists")
        );
      } else if (response.status === 402) {
        throw new Error(
          Localization.sharedValue("CreateUser_OutfitDoesNotExist")
        );
      }

      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  /*
  ** API call to update a user's information
  */
  static async updateUser(userId: string, role: Role) {
    var items = {
      userId: userId,
      roleId: role.id
    };

    let response = await fetch(
      Base.url("updateUserRole"),
      Base.defaultConfig(items)
    );

    let responseJson = await response.json();

    try {
      return new User(responseJson);
    } catch {
      if (response.status === 400) {
        throw new Error(Localization.sharedValue("Users_UserNotFound"));
      } else {
        throw new Error(Localization.sharedValue("Error_General"));
      }
    }
  }

  /*
  ** API call to get a list of available user roles
  */
  static async listRoles() {
    let response = await fetch(
      Base.url("roles/list", {}),
      Base.defaultConfig()
    );

    if (response.ok) {
      let responseJson = await response.json();
      return responseJson.map(role => {
        return new Role({ name: role.roleName, id: role.roleId });
      });
    } else {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  /*
  ** API call to get a role's details
  */
  static async getRole(roleId: string): Promise<Role> {
    let response = await fetch(
      Base.url("roles/details", {}),
      Base.defaultConfig({ roleId: roleId })
    );

    if (response.ok) {
      let responseJson = await response.json();
      var role = new Role({
        name: responseJson.role.roleName,
        id: responseJson.role.roleId
      });

      // Hack to get rid of dupes, remove when possible
      role.setClaims(
        this.getDistinctGroups(responseJson.groups).map(
          group => new ClaimGroup(group)
        )
      );

      return role;
    } else {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  /*
  ** API call to update a role's details
  */
  static async updateRole(
    roleId: string,
    roleName: string,
    claimGroups: ClaimGroup[]
  ) {
    var items = {
      roleId: roleId,
      roleName: roleName,
      groupIds: claimGroups!.map(cg => cg.id)
    };

    let response = await fetch(
      Base.url("roles/update", {}),
      Base.defaultConfig(items)
    );

    if (response.ok) {
      return true;
    } else {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  /*
  ** API call to create a role
  */
  static async createRole(roleName: string, claimGroups: ClaimGroup[]) {
    var items = {
      roleName: roleName,
      groupIds: claimGroups.map(cg => cg.id)
    };

    let response = await fetch(
      Base.url("roles/create", {}),
      Base.defaultConfig(items)
    );

    if (response.ok) {
      return true;
    } else {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  /*
  ** API call to get a list of claim groups
  */
  static async getClaimGroups(): Promise<ClaimGroup[]> {
    let response = await fetch(
      Base.url("groups/list", {}),
      Base.defaultConfig()
    );

    if (response.ok) {
      let responseJson = await response.json();

      // Hack to get rid of dupes, remove when possible
      return this.getDistinctGroups(responseJson).map(cg => {
        return new ClaimGroup(cg);
      });
    } else {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  // tslint:disable-next-line:no-any
  private static getDistinctGroups(data: any[]) {
    // tslint:disable-next-line:no-any
    let claimGroups: any[] = [];
    const map = new Map();
    for (const group of data) {
      if (!map.has(group.groupId)) {
        map.set(group.groupId, true);
        claimGroups.push({
          groupId: group.groupId,
          groupName: group.groupName
        });
      }
    }

    return claimGroups;
  }
}
