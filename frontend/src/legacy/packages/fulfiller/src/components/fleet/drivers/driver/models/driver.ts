import { observable, computed } from "mobx";
import { PersonName } from "shared/src/model/general/personName";
import { Phone } from "shared/src/model/general/phone";

export class Driver {

  /* tslint:disable-next-line: no-any */
  public constructor(data?: any) {
    if (data != null) {
      this.id = data.id;
      this.name = new PersonName(data.name);
      this.email = data.email;
      this.phone = new Phone(data.phone);
    } else {
      this.name = new PersonName();
      this.phone = new Phone();
    }
  }

  @observable
  public id?: number;

  @observable
  public name: PersonName;

  @observable
  public phone: Phone;

  @observable
  public email: string;

  @observable
  public password: string;

  @computed
  public get isValid(): boolean {
    return !!(
      this.name &&
      this.name.isValid &&
      this.phone &&
      this.phone.isValid &&
      this.email
    );
  }
}
