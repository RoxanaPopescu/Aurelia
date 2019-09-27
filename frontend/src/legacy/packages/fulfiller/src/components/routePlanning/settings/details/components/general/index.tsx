import React from "react";
import "./styles.scss";
import { RoutePlanningSettingsStore } from "../../store";
import {
  InputNumbers,
  ButtonType,
  Input,
  MultiSelect,
  Select
} from "shared/src/webKit";
import DividerComponent from "shared/src/webKit/divider";
import { ButtonSize, Button } from "shared/src/webKit/button";
import OrderGroupService from "fulfiller/src/services/orderGroupService";
import { OrderGroup } from "shared/src/model/logistics/orderGroups/orderGroup";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Outfit } from "shared/src/model/logistics/outfit";
import { AgreementsService } from "shared/src/services/agreementsService";
import { OptionValue } from "react-selectize";
import InputCheckbox from "shared/src/webKit/input/checkbox";
import { RoutePlanStrategy } from "shared/src/model/logistics/routePlanning/settings/strategy";

interface Props {
  store: RoutePlanningSettingsStore;
}

@observer
export default class GeneralComponent extends React.Component<Props> {
  @observable validate = false;

  @observable
  orderGroups?: OrderGroup[];

  @observable
  consignors?: Outfit[];

  componentDidMount() {
    OrderGroupService.getOrderGroups()
      .then(groups => {
        this.orderGroups = groups;
      })
      .catch(error => {
        // Do nothing
      });

    AgreementsService.fulfilees()
      .then(agreements => {
        this.consignors = agreements;
      })
      .catch(error => {
        // Do nothing
      });
  }

  orderGroupsValues(): OptionValue[] | undefined {
    if (!this.orderGroups) {
      return;
    }

    let values: OptionValue[] = [];
    for (let group of this.orderGroups) {
      if (this.props.store.setting.orderGroupIds.includes(group.id)) {
        values.push({ label: group.name, value: group.id });
      }
    }

    return values;
  }

  consignorValues(): OptionValue[] | undefined {
    if (!this.consignors) {
      return;
    }

    let values: OptionValue[] = [];
    for (let consignor of this.consignors) {
      if (this.props.store.setting.consignorIds.includes(consignor.id)) {
        values.push({ label: consignor.companyName!, value: consignor.id! });
      }
    }

    return values;
  }

  validateInput() {
    let setting = this.props.store.setting;
    if (
      !setting.name ||
      !setting.parameters.limitations.validate() ||
      !setting.parameters.loadingTimes.validate()
    ) {
      this.validate = true;
      return;
    }

    this.props.store.updateSetting();
  }

  render() {
    return (
      <div className="c-rp-s-g-container">
        <Input
          size={"medium"}
          headline="NAVN FOR INDSTILLINGERNE"
          placeholder="Indtast navn"
          onChange={value => {
            this.props.store.setting.name = value;
          }}
          value={this.props.store.setting.name}
          error={this.validate && !this.props.store.setting.name}
        />
        <DividerComponent />
        <p className="font-large margin">Hvem omhandler det</p>
        <div className="c-rp-s-g-twoInput">
          <MultiSelect
            disabled={this.orderGroups === undefined}
            size={"medium"}
            headline="ORDRE GRUPPER"
            placeholder={this.orderGroups ? "Vælg ordregruppe" : "Henter..."}
            options={
              this.orderGroups
                ? this.orderGroups.map(group => {
                    return { label: group.name, value: group.id };
                  })
                : undefined
            }
            onChange={results => {
              let ids: string[] = [];
              if (results) {
                for (let result of results) {
                  ids.push(result.value);
                }
              }

              this.props.store.setting.orderGroupIds = ids;
            }}
            values={this.orderGroupsValues()}
          />
          <MultiSelect
            disabled={this.consignors === undefined}
            size={"medium"}
            headline="AFSENDER KUNDER"
            placeholder={this.consignors ? "Vælg afsenderkunder" : "Henter..."}
            options={
              this.consignors
                ? this.consignors.map(consignor => {
                    return {
                      label: consignor.companyName!,
                      value: consignor.id!
                    };
                  })
                : undefined
            }
            onChange={results => {
              let ids: string[] = [];
              if (results) {
                for (let result of results) {
                  ids.push(result.value);
                }
              }

              this.props.store.setting.consignorIds = ids;
            }}
            values={this.consignorValues()}
          />
        </div>
        <DividerComponent />
        <p className="font-large margin">Begrænsninger</p>
        <div className="c-rp-s-g-twoInput">
          <InputNumbers
            size={"medium"}
            headline="MAX ANTAL RUTER PR. RUTEOPTIMERING"
            valueDescription="ruter"
            value={
              this.props.store.setting.parameters.limitations
                .maximumRoutesCount
            }
            onChange={value => {
              this.props.store.setting.parameters.limitations.maximumRoutesCount = value;
            }}
            error={
              this.validate &&
              !this.props.store.setting.parameters.limitations
                .maximumRoutesCount
            }
          />
          <InputNumbers
            size={"medium"}
            headline="MAX ANTAL STOP PR RUTE"
            valueDescription="stops"
            value={
              this.props.store.setting.parameters.limitations
                .maximumStopPerRouteCount
            }
            onChange={value => {
              this.props.store.setting.parameters.limitations.maximumStopPerRouteCount = value;
            }}
            error={
              this.validate &&
              !this.props.store.setting.parameters.limitations
                .maximumStopPerRouteCount
            }
          />
        </div>
        <div className="c-rp-s-g-threeInput">
          <InputNumbers
            size={"medium"}
            headline="MAX ANTAL KOLLI"
            valueDescription="kolli"
            value={
              this.props.store.setting.parameters.limitations
                .maximumColliCount
            }
            onChange={value => {
              this.props.store.setting.parameters.limitations.maximumColliCount = value;
            }}
            error={
              this.validate &&
              !this.props.store.setting.parameters.limitations
                .maximumColliCount
            }
          />
          <InputNumbers
            size={"medium"}
            headline="MAX TID PR RUTE"
            valueDescription="min"
            value={
              this.props.store.setting.parameters.limitations
                .maximumTimePerRoute
                ? Math.round(
                    (this.props.store.setting.parameters.limitations
                      .maximumTimePerRoute /
                      60) *
                      100
                  ) / 100
                : undefined
            }
            onChange={value => {
              if (value) {
                this.props.store.setting.parameters.limitations.maximumTimePerRoute =
                  value * 60;
              } else {
                this.props.store.setting.parameters.limitations.maximumTimePerRoute = undefined;
              }
            }}
            error={
              this.validate &&
              !this.props.store.setting.parameters.limitations
                .maximumTimePerRoute
            }
          />
          <InputNumbers
            size={"medium"}
            headline="MAX VÆGT"
            valueDescription="kg"
            value={
              this.props.store.setting.parameters.limitations.maximumWeight
            }
            onChange={value => {
              this.props.store.setting.parameters.limitations.maximumWeight = value;
            }}
            error={
              this.validate &&
              !this.props.store.setting.parameters.limitations.maximumWeight
            }
          />
        </div>
        <InputNumbers
          size={"medium"}
          headline="START PRIS PR YDERLIGERE RUTE"
          value={
            this.props.store.setting.parameters.limitations
              .startCostOfAdditionalRoute
          }
          onChange={value => {
            this.props.store.setting.parameters.limitations.startCostOfAdditionalRoute = value;
          }}
          error={
            this.validate &&
            !this.props.store.setting.parameters.limitations
              .startCostOfAdditionalRoute
          }
        />
        <InputCheckbox
          checked={
            this.props.store.setting.parameters.limitations
              .vehicleShouldReturnToPickup
          }
          onChange={value =>
            (this.props.store.setting.parameters.limitations.vehicleShouldReturnToPickup = value)
          }
        >
          Tilføj første afhentningsstop som returstop
        </InputCheckbox>
        <InputCheckbox
          checked={
            this.props.store.setting.parameters.limitations
              .oneRoutePlanningPerPickup
          }
          onChange={value =>
            (this.props.store.setting.parameters.limitations.oneRoutePlanningPerPickup = value)
          }
        >
          Opret en route planlægning for hver afhentnings lokation
        </InputCheckbox>
        <DividerComponent />
        <p className="font-large margin">Flow parametre</p>
        <InputCheckbox
          checked={
            this.props.store.setting.parameters.flowParameters
              .manuallyApproveRoutes
          }
          onChange={value =>
            (this.props.store.setting.parameters.flowParameters.manuallyApproveRoutes = value)
          }
        >
          Godkend ruter manuelt
        </InputCheckbox>
        <DividerComponent />
        <p className="font-large margin">Strategi</p>
        <Select
          value={
            this.props.store.setting.parameters.strategy ? this.props.store.setting.parameters.strategy.slug : undefined
          }
          options={this.props.store.availableStrategies.map(s => {
            return { label: s.name, value: s.slug }
          })}
          onSelect={option => {
            if (option) {
              this.props.store.setting.parameters.strategy = new RoutePlanStrategy(option.value);
            }
          }}
        >
          Godkend ruter manuelt
        </Select>
        <DividerComponent />
        <p className="font-large margin">Læssetider</p>
        <InputNumbers
          size={"medium"}
          headline="KOLLI PR. INDBÆRING"
          valueDescription="kolli"
          value={
            this.props.store.setting.parameters.loadingTimes
              .colliCountPerDeliveryRound
          }
          onChange={value => {
            this.props.store.setting.parameters.loadingTimes.colliCountPerDeliveryRound = value;
          }}
          error={
            this.validate &&
            !this.props.store.setting.parameters.loadingTimes
              .colliCountPerDeliveryRound
          }
        />
        <div className="c-rp-s-g-twoInput">
          <InputNumbers
            size={"medium"}
            headline="TID TIL PARKERING"
            valueDescription="sec"
            value={
              this.props.store.setting.parameters.loadingTimes.timeForParking
            }
            onChange={value => {
              this.props.store.setting.parameters.loadingTimes.timeForParking = value;
            }}
            error={
              this.validate &&
              !this.props.store.setting.parameters.loadingTimes.timeForParking
            }
          />
          <InputNumbers
            size={"medium"}
            headline="TID PR. INDBÆRING"
            valueDescription="sec"
            value={
              this.props.store.setting.parameters.loadingTimes
                .timePerDeliveryRound
            }
            onChange={value => {
              this.props.store.setting.parameters.loadingTimes.timePerDeliveryRound = value;
            }}
            error={
              this.validate &&
              !this.props.store.setting.parameters.loadingTimes
                .timePerDeliveryRound
            }
          />
        </div>
        <div className="c-rp-s-g-twoInput">
          <InputNumbers
            size={"medium"}
            headline="EKSTRA TID PR. ETAGE PR. INDBÆRING"
            valueDescription="sec"
            value={
              this.props.store.setting.parameters.loadingTimes.timePerFloor
            }
            onChange={value => {
              this.props.store.setting.parameters.loadingTimes.timePerFloor = value;
            }}
            error={
              this.validate &&
              !this.props.store.setting.parameters.loadingTimes.timePerFloor
            }
          />
          <InputNumbers
            size={"medium"}
            headline="LÆSSETID VED AFHENTNING"
            valueDescription="min"
            value={
              this.props.store.setting.parameters.loadingTimes
                .pickupLoadingTime
                ? Math.round(
                    (this.props.store.setting.parameters.loadingTimes
                      .pickupLoadingTime /
                      60) *
                      100
                  ) / 100
                : undefined
            }
            onChange={value => {
              if (value) {
                this.props.store.setting.parameters.loadingTimes.pickupLoadingTime =
                  value * 60;
              } else {
                this.props.store.setting.parameters.loadingTimes.pickupLoadingTime = undefined;
              }
            }}
            error={
              this.validate &&
              !this.props.store.setting.parameters.loadingTimes
                .pickupLoadingTime
            }
          />
        </div>
        <Button
          size={ButtonSize.Medium}
          onClick={() => this.validateInput()}
          type={ButtonType.Action}
          disabled={this.props.store.saving}
          loading={this.props.store.saving}
        >
          {this.props.store.setting.id
            ? "Opdater indstillinger"
            : "Opret indstillinger"}
        </Button>
      </div>
    );
  }
}
