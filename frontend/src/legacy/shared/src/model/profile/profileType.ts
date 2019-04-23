export enum ProfileType {
  User,
  Admin
}

export namespace DynamicPriceType {
  export function title(type: ProfileType): string {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case ProfileType.User:
        return "User type";
      case ProfileType.Admin:
        return "Admin type";
    }
  }
}
