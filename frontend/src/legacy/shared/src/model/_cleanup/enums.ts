import Localization from "shared/src/localization";

export enum UserType {
  Customer = 1,
  Driver = 4,
  Business = 8,
  ContentEditor = 90,
  Investor = 99,
  Admin = 100,
  SuperAdmin = 200
}

export namespace UserType {
  export function title(type: UserType): string {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case UserType.Customer:
        return Localization.sharedValue("User_Customer");
      case UserType.Driver:
        return Localization.sharedValue("User_Driver");
      case UserType.Business:
        return Localization.sharedValue("User_Business");
      case UserType.ContentEditor:
        return "";
      case UserType.Investor:
        return Localization.sharedValue("User_Investor");
      case UserType.Admin:
        return Localization.sharedValue("User_Admin");
      case UserType.SuperAdmin:
        return "";
    }
  }
}
