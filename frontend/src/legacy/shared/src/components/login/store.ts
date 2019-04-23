import { observable } from "mobx";

export class LoginStore {
  @observable
  loading: boolean;
  @observable
  validate: boolean;
  @observable
  email?: string;
  @observable
  password?: string;
  @observable
  error?: string;
}
