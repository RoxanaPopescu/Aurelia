/**
 * Represents the user of the app.
 */
export class UserInfo {
  public id: string;
  public username: string;
  public firstName: string;
  public lastName?: string;
  public email: string;

  /* tslint:disable: no-any */
  public constructor(data: any) {
    this.id = data.userId;
    this.username = data.username;
    this.firstName = data.firstName;
    if (data.lastName && data.lastName.length > 0) {
      this.lastName = data.lastName;
    }
    this.email = data.email;
  }

  get fullName(): string {
    return this.lastName !== undefined
      ? this.firstName + " " + this.lastName
      : this.firstName;
  }

  get initials(): string {
    return this.lastName !== undefined
      ? this.firstName.charAt(0) + this.lastName.charAt(0)
      : this.firstName.charAt(0) + this.firstName.charAt(1);
  }
}
