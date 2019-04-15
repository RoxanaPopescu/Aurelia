import { observable } from "mobx";
import { ClaimGroup } from "shared/src/model/profile/user";

export class RoleStore {
  @observable loading: boolean = false;
  @observable error?: string;
  @observable success?: string;
  @observable validate: boolean = false;

  @observable availableClaimGroups?: ClaimGroup[];
  @observable roleId?: string;
  @observable roleName?: string;
  @observable chosenClaimGroups?: ClaimGroup[];
  @observable modalOpen: boolean = false;
}
