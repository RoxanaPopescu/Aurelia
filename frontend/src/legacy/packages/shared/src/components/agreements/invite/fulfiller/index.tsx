import React from "react";
import { observer } from "mobx-react";
import { Input, Button, ButtonType, ButtonSize } from "shared/src/webKit";
import { observable } from "mobx";
import { AgreementsService } from "shared/src/services/agreementsService";

export interface Props {
  added: () => void;
}

@observer
export class InviteFulfiller extends React.Component<Props> {
  @observable companyName?: string;
  @observable publicId?: string;
  @observable firstName?: string;
  @observable lastName?: string;
  @observable email?: string;
  @observable loading = false;

  create() {
    this.loading = true;

    AgreementsService.inviteFulfiller(
      this.publicId!,
      this.companyName!,
      this.firstName!,
      this.lastName!,
      this.email!
    )
      .then(() => {
        this.props.added();
      })
      .catch(error => {
        window.alert("Der skete desværre en fejl: " + error.message);
        this.loading = false;
      });
  }

  canCreate(): boolean {
    if (this.loading) {
      return false;
    }

    if (
      !this.publicId ||
      !this.companyName ||
      !this.firstName ||
      !this.lastName ||
      !this.email
    ) {
      return false;
    }

    return true;
  }

  public render() {
    return (
      <div className="c-autoDispatch-form c-autoDispatch-ruleForm">
        <Input
          size={"medium"}
          headline="Firmanavn"
          placeholder="Indskriv firmanavn"
          onChange={value => {
            this.companyName = value;

            let converted = value.replace(/[^a-zA-Z ]/g, "").replace(/ /g, "-");
            this.publicId = converted;
          }}
          disabled={this.loading}
          value={this.companyName}
        />
        <Input
          size={"medium"}
          headline="Brugerens fornavn"
          placeholder="Fornavn"
          onChange={value => (this.firstName = value)}
          disabled={this.loading}
          value={this.firstName}
        />
        <Input
          size={"medium"}
          headline="Brugerens efternavn"
          placeholder="Efternavn"
          onChange={value => (this.lastName = value)}
          disabled={this.loading}
          value={this.lastName}
        />
        <Input
          size={"medium"}
          headline="Brugerens email"
          placeholder="Email"
          onChange={value => (this.email = value)}
          disabled={this.loading}
          value={this.email}
        />
        <Input
          size={"medium"}
          headline="Fulfuller public id (kan være deres navn)"
          placeholder="Public id"
          onChange={value => (this.publicId = value)}
          disabled={this.loading}
          value={this.publicId}
        />
        <Button
          type={ButtonType.Action}
          size={ButtonSize.Medium}
          disabled={!this.canCreate()}
          loading={this.loading}
          onClick={() => this.create()}
        >
          Inviter
        </Button>
      </div>
    );
  }
}
