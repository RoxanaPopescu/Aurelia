import { observable } from "mobx";

export class ActivationStore {
  @observable loading: boolean = false;
  @observable validate: boolean = false;
  @observable username?: string;
  @observable activationCode?: string;
  @observable password?: string;
  @observable passwordConfirmation?: string;
  @observable error?: string;
}
