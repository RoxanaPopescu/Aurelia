import React from "react";
import "./styles.scss";
import { DepotStore } from "../../store";
import { ButtonType, Input, InputNumbers } from "shared/src/webKit";
import { ButtonSize, Button } from "shared/src/webKit/button";
import AddressSearchComponent from "shared/src/components/addressSearch";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Profile } from "shared/src/model/profile";
import Localization from "shared/src/localization";

interface Props {
  store: DepotStore;
}

@observer
export default class DepotGeneralComponent extends React.Component<Props> {
  @observable validate = false;

  validateInput() {
    let depot = this.props.store.depot;
    if (!depot.name || !depot.location || !depot.slotInterval) {
      this.validate = true;
      return;
    }

    this.props.store.updateDepot();
  }

  render() {
    return (
      <div className="c-depotsGeneral-container">
        <Input
          size={"medium"}
          headline={Localization.sharedValue("Header_Name")}
          onChange={name => (this.props.store.depot.name = name)}
          error={this.validate && !this.props.store.depot.name}
          value={this.props.store.depot.name}
          readonly={!Profile.claims.has("edit-depot")}
        />
        <AddressSearchComponent
          headline={Localization.sharedValue("Address")}
          error={this.validate && !this.props.store.depot.location}
          onChange={location => {
            this.props.store.depot.location = location;
          }}
          value={this.props.store.depot.location}
          placeholder={Localization.operationsValue("Depots_General_Address:Placeholder")}
          locationRequired={true}
          disabled={!Profile.claims.has("edit-depot")}
        />
        <InputNumbers
          size={"medium"}
          headline={Localization.operationsValue("Depots_General_SlotInterval")}
          valueDescription="min"
          error={this.validate && !this.props.store.depot.slotInterval}
          onChange={slotInterval => {
            if (slotInterval) {
              this.props.store.depot.slotInterval = slotInterval * 60;
            } else {
              this.props.store.depot.slotInterval = undefined;
            }
          }}
          value={
            this.props.store.depot.slotInterval
              ? this.props.store.depot.slotInterval / 60
              : undefined
          }
          readonly={!Profile.claims.has("edit-depot")}
        />
        {Profile.claims.has("edit-depot") &&
        <Button
          size={ButtonSize.Medium}
          onClick={() => this.validateInput()}
          type={ButtonType.Action}
          loading={this.props.store.saving}
          disabled={this.props.store.saving}
        >
          {this.props.store.depot.id ? Localization.operationsValue("Depots_General_Update:Button") : Localization.operationsValue("Depots_General_Create:Button")}
        </Button>}
      </div>
    );
  }
}
