import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import {
  SinglePriceStore,
  SingleRule,
  StoreVehicle
} from "../cleanup/dynamicPrices/dynamicPriceRule";
import { InputNumbers, InputRadioGroup } from "shared/src/webKit";
import { DynamicPriceType } from "../cleanup/dynamicPrices/enums/dynamicPriceType";
import { DynamicPriceStore } from "../cleanup/dynamicPrices/dynamicPriceIndex";
import AddRule from "./add";

interface Props {
  store: DynamicPriceStore;
}

@observer
export default class Rule extends React.Component<Props> {
  ruleStore: SinglePriceStore;

  constructor(props: Props) {
    super(props);

    let store = new SinglePriceStore(props.store.template);
    this.props.store.rules = store;
    this.ruleStore = store;
  }

  ruleHeader(rule: SingleRule) {
    let canCalculateWithEstimate = DynamicPriceType.canCalculateWithEstimate(
      rule,
      this.ruleStore.items
    );

    return (
      <div
        key={rule.id}
        className="c-ruleContainer-item c-ruleContainer-primary 
                c-ruleTitleContainer c-ruleContainer-horizontalSpace"
      >
        <div className="c-ruleTitleContainer-title">{rule.title}</div>
        {canCalculateWithEstimate && (
          <InputRadioGroup
            radioButtons={[
              { value: "0", headline: "Estimeret" },
              { value: "1", headline: "Aktuel" }
            ]}
            className="c-ruleTitleContainer-estimatedActual"
            //checkedIndex={0}
            small={true}
            onChange={() => {
              // fixme
            }}
          />
        )}
        {canCalculateWithEstimate === false &&
          rule.type === DynamicPriceType.Zones && (
            <div className="list2 c-ruleTitleContainer-info">
              Beregned som Zone 1
            </div>
          )}
      </div>
    );
  }

  ruleContent(vehicle: StoreVehicle, rule?: SingleRule) {
    let ruleKeyId: string;
    let classNames: string;

    if (rule) {
      ruleKeyId = rule.id;
      classNames = "c-ruleContainer-item c-ruleContainer-primary body";
    } else {
      ruleKeyId = "noRule";
      classNames = "c-ruleContainer-item c-ruleContainer-dotted body";
    }

    if (vehicle.enabled) {
      if (rule && rule.type === DynamicPriceType.Zones) {
        return (
          <React.Fragment>
            <div
              key={ruleKeyId + "-half1-" + vehicle.type}
              className={classNames}
            >
              <InputNumbers
                className="c-ruleContainer-input"
                height="100%"
                value={undefined}
                gridMode={true}
                placeholder="--"
                valueDescription="km."
                headline="Kilometer"
                inlineHeadline={true}
                onChange={() => {
                  // FIXME: Later
                }}
              />
            </div>
            <div
              key={ruleKeyId + "-half2-" + vehicle.type}
              className={classNames}
            >
              <InputNumbers
                className="c-ruleContainer-input"
                height="100%"
                value={undefined}
                gridMode={true}
                placeholder="--"
                valueDescription="kr."
                headline="Pris"
                inlineHeadline={true}
                onChange={() => {
                  // FIXME: Later
                }}
              />
            </div>
          </React.Fragment>
        );
      }

      return (
        <div
          key={ruleKeyId + "-" + vehicle.type}
          className={classNames + " c-ruleContainer-doubleItem"}
        >
          {rule && (
            <InputNumbers
              className="c-ruleContainer-input"
              height="100%"
              value={undefined}
              gridMode={true}
              placeholder="Pris"
              valueDescription="kr."
              onChange={() => {
                // FIXME: Later
              }}
            />
          )}
        </div>
      );
    } else {
      return (
        <div
          key={ruleKeyId + "-" + vehicle.type}
          className="c-ruleContainer-item c-ruleContainer-dotted body c-ruleContainer-doubleItem"
        />
      );
    }
  }

  // tslint:disable-next-line:no-any
  addAdditionalZoneRules(components: any) {
    // Push additional zone column
    components.push(
      <div className="c-ruleContainer-item c-ruleContainer-dotted body">
        <div
          className="cta3 c-ruleContainer-dynamicPricesLink c-ruleContainer-horizontalSpace"
          onClick={() => this.ruleStore.addRule(DynamicPriceType.Zones)}
        >
          Tilføj ekstra zone
        </div>
      </div>
    );

    this.ruleStore.vehicles.forEach(vehicle => {
      components.push(this.ruleContent(vehicle));
    });

    components.push(
      <div
        key="zone-remove"
        className="c-ruleContainer-item c-ruleContainer-dotted body"
      />
    );

    // Push price for km after zones
    let rule = new SingleRule(DynamicPriceType.ZonesPriceKmOver);

    components.push(this.ruleHeader(rule));

    this.ruleStore.vehicles.forEach(vehicle => {
      components.push(this.ruleContent(vehicle, rule));
    });

    components.push(
      <div
        key="additional-km-remove"
        className="c-ruleContainer-item c-ruleContainer-dotted body"
      />
    );
  }

  rules() {
    // tslint:disable-next-line:no-any
    var components: any = [];

    this.ruleStore.items.forEach((rule, index) => {
      components.push(this.ruleHeader(rule));

      this.ruleStore.vehicles.forEach(vehicle => {
        components.push(this.ruleContent(vehicle, rule));
      });

      components.push(
        <div
          key={rule.id + "-remove"}
          className="c-ruleContainer-item c-ruleContainer-dotted body"
        >
          <div
            className="cta3 c-ruleContainer-removeRule c-ruleContainer-horizontalSpace"
            onClick={() => this.ruleStore.removeRule(rule)}
          >
            Fjern række
          </div>
        </div>
      );

      // if the next rule is not a zone or last in list show additional km price
      if (rule.type === DynamicPriceType.Zones) {
        if (
          this.ruleStore.items.length === index + 1 ||
          (this.ruleStore.items.length > index + 1 &&
            this.ruleStore.items[index + 1].type !== DynamicPriceType.Zones)
        ) {
          this.addAdditionalZoneRules(components);
        }
      }
    });

    return components;
  }

  vehicleHeader(vehicle: StoreVehicle) {
    if (vehicle.enabled) {
      return (
        <div
          key={vehicle.type + "_header"}
          className="c-ruleContainer-itemc-ruleContainer-primary c-ruleContainer-header body 
                    c-ruleContainer-horizontalSpace c-ruleContainer-inputDefault c-ruleContainer-doubleItem"
        >
          {vehicle.title}
          <div
            className="c-ruleContainer-remove cta2"
            onClick={() => this.ruleStore.removeVehicle(vehicle)}
          >
            <img src={require("./assets/close.svg")} />
          </div>
        </div>
      );
    }

    return (
      <div
        key={vehicle.type + "_header"}
        onClick={() => this.ruleStore.enableVehicle(vehicle)}
        className="c-ruleContainer-item c-ruleContainer-dotted c-ruleContainer-header 
                c-ruleContainer-horizontalSpace c-ruleContainer-doubleItem"
      >
        <div className="cta3 c-ruleContainer-dynamicPricesLink">
          {vehicle.addTitle}
        </div>
      </div>
    );
  }

  render() {
    var gridStyle = {
      gridTemplateColumns:
        "220px repeat(" +
        this.ruleStore.vehicles.length * 2 +
        ", 110px) max-content"
    };

    return (
      <React.Fragment>
        <div className="singlePrice">
          <div className="c-ruleContainer" style={gridStyle}>
            <div
              className="c-ruleContainer-item c-ruleContainer-primary body 
                            c-ruleContainer-header cta1 c-ruleContainer-horizontalSpace"
            >
              Regler
            </div>
            {this.ruleStore.vehicles.map(vehicle =>
              this.vehicleHeader(vehicle)
            )}
            <div className="c-ruleContainer-item c-ruleContainer-dotted c-ruleContainer-header" />
            {this.rules()}
            <div className="c-ruleContainer-item c-ruleContainer-dotted body">
              <div
                className="cta3 c-ruleContainer-dynamicPricesLink c-ruleContainer-horizontalSpace"
                onClick={() => (this.ruleStore.addingRule = true)}
              >
                Tilføj regel
              </div>
            </div>
            {this.ruleStore.vehicles.map(vehicle => (
              <div
                key={vehicle.type + "-end"}
                className="c-ruleContainer-item c-ruleContainer-dotted body c-ruleContainer-doubleItem"
              />
            ))}
            <div className="c-ruleContainer-item c-ruleContainer-dotted body" />
          </div>
        </div>
        {this.ruleStore.addingRule && <AddRule store={this.ruleStore} />}
      </React.Fragment>
    );
  }
}
