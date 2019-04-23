export default class User {
  public id: string;
  public username: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public outfitId: string;
  public role: Role;

  // tslint:disable-next-line:no-any
  constructor(json: any) {
    this.id = json.id;
    this.username = json.userName;
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.email = json.email;
    this.outfitId = json.outfitId;
    this.role = new Role({ id: json.roleId, name: json.roleName });
  }

  public get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    } else {
      return "--";
    }
  }
}

export class UserPhone {
  countryCode: string;
  formatted: string;
  phoneNumber: string;

  // tslint:disable-next-line:no-any
  constructor(data?: { [Key: string]: any }) {
    if (data === undefined) {
      this.countryCode = "";
      this.formatted = "";
      this.phoneNumber = "";
      return;
    }

    this.countryCode = data.countryCode;
    this.formatted = data.formatted;
    this.phoneNumber = data.number;
  }
}

export class UserImage {
  small: string;
  large: string;

  // tslint:disable-next-line:no-any
  constructor(data?: { [Key: string]: any }) {
    if (data === undefined) {
      this.small = "";
      this.large = "";
      return;
    }

    this.small = data.small;
    this.large = data.large;
  }
}

export class Role {
  name?: string;
  id: string;
  claimGroups?: ClaimGroup[];

  // tslint:disable-next-line:no-any
  constructor(data: { [Key: string]: any }) {
    this.name = data.name;
    this.id = data.id;
  }

  public setClaims(claimGroups: ClaimGroup[]) {
    this.claimGroups = claimGroups;
  }
}

export class ClaimGroup {
  name: string;
  id: string;

  // tslint:disable-next-line:no-any
  constructor(data: { [Key: string]: any }) {
    this.name = data.groupName;
    this.id = data.groupId;
  }
}
