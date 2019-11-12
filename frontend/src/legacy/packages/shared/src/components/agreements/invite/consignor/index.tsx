import React from "react";
import { observer } from "mobx-react";
import { Input, Button, ButtonType, ButtonSize, InputPhone, InputNumbers } from "shared/src/webKit";
import { observable } from "mobx";
import { AgreementsService } from "shared/src/services/agreementsService";
import { Phone } from "shared/src/model/general/phone";
import { Log } from "shared/infrastructure";

export interface Props {
  added: () => void;
}

@observer
export class InviteConsignor extends React.Component<Props> {
  @observable companyName?: string;
  @observable publicId?: string;
  @observable firstName?: string;
  @observable lastName?: string;
  @observable email?: string;
  @observable phoneCountryPrefix?: string;
  @observable phoneNumber?: string;
  @observable address?: string;
  @observable loading = false;

  create() {
    this.loading = true;

    AgreementsService.inviteConsignor(
      this.publicId!,
      this.companyName!,
      this.firstName!,
      this.lastName!,
      this.email!,
      new Phone({
        countryPrefix: this.phoneCountryPrefix!,
        number: this.phoneNumber!
      }),
      this.address!
    )
      .then(() => {
        this.props.added();
      })
      .catch(error => {
        Log.error(error);
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
      !this.email ||
      !this.address ||
      !this.phoneCountryPrefix ||
      !this.phoneNumber
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
            let converted = value ? value.replace(/[^a-zA-Z ]/g, "").replace(/ /g, "-") : "";
            this.publicId = converted;
          }}
          disabled={this.loading}
          value={this.companyName}
        />
        <Input
          size={"medium"}
          headline="Public id (kan være deres navn)"
          placeholder="Public id"
          onChange={value => (this.publicId = value)}
          disabled={this.loading}
          value={this.publicId}
        />
        <Input
          size={"medium"}
          headline="Adresse"
          placeholder="Adresse"
          onChange={value => (this.address = value)}
          disabled={this.loading}
          value={this.address}
        />
        <Input
          size={"medium"}
          headline="Kontaktpersons fornavn"
          placeholder="Fornavn"
          onChange={value => (this.firstName = value)}
          disabled={this.loading}
          value={this.firstName}
        />
        <Input
          size={"medium"}
          headline="Kontaktpersons efternavn"
          placeholder="Efternavn"
          onChange={value => (this.lastName = value)}
          disabled={this.loading}
          value={this.lastName}
        />
        <Input
          size={"medium"}
          headline="Kontaktpersons email"
          placeholder="Email"
          onChange={value => (this.email = value)}
          disabled={this.loading}
          value={this.email}
        />
        <InputPhone
          size={"medium"}
          headline="Kontaktpersons telefonnummer"
          placeholder="Telefonnummer"
          onChange={value => (this.phoneNumber = value)}
          disabled={this.loading}
          maxlength={8}
          minlength={8}
          value={this.phoneNumber}
        />
        <InputNumbers
          size={"medium"}
          headline="Landekode telefonnummer"
          placeholder="45"
          onChange={value =>( this.phoneCountryPrefix = value ? value!.toString() : "")}
          disabled={this.loading}
          maxlength={2}
          minlength={2}
          value={this.phoneCountryPrefix ? parseInt(this.phoneCountryPrefix) : undefined}
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
