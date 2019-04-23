import React from "react";
import "./styles.scss";
import { DepotStore } from "../../store";
import { observer } from "mobx-react";
import { ButtonType, Button } from "shared/src/webKit";
import { ButtonSize } from "shared/src/webKit/button";
import { PortComponent } from "./components/port";
import GUID from "../../../../../../../shared/src/webKit/utillity/guid";
import { Availability } from "shared/src/model/logistics/depots";

interface Props {
  store: DepotStore;
}

@observer
export default class DepotPortsComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className="c-depotPort-container">
        {}
        {this.props.store.depot.availabilities.map(port => (
          <PortComponent
            key={GUID.generate()}
            port={port}
            onEdit={() => {
              this.props.store.activeGate = port;
            }}
          />
        ))}
        <Button
          className="c-depotPort-add"
          size={ButtonSize.Medium}
          onClick={() => (this.props.store.activeGate = new Availability())}
          type={ButtonType.Action}
        >
          + Tilføj porte
        </Button>
      </div>
    );
  }
}
