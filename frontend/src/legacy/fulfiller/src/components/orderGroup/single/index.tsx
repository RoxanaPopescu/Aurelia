import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import H from "history";
import {
  ContentBox,
  Input,
  Button,
  ButtonType,
  Select
} from "shared/src/webKit";
import MultiSelectComponent from "../../../../../shared/src/webKit/select/multiSelect/index";
import { OrderGroupStore } from "./store";
import OrderGroupService from "../../../services/orderGroupService";
import ButtonAdd from "../../../../../shared/src/webKit/button/add/index";
import { ButtonSize } from "shared/src/webKit/button";
import TimeComponent from "../../../../../shared/src/webKit/date/time/index";
import DividerComponent from "../../../../../shared/src/webKit/divider/index";
import { Consignor } from "shared/src/model/logistics/consignor";
import { AgreementsService } from "shared/src/services/agreementsService";
import { observable } from "mobx";

const orderGroupStore = new OrderGroupStore();

interface Props {
  // tslint:disable-next-line:no-any
  match: any;
  history?: H.History;
}

@observer
export default class OrderGroupComponent extends React.Component<Props> {

  @observable
  private consignors: Consignor[];

  constructor(props: Props) {
    super(props);

    if (props.match.params.id != null) {
      document.title = Localization.operationsValue("OrderGroup_EditTitle");
    } else {
      document.title = Localization.operationsValue("OrderGroup_CreateTitle");
    }

    orderGroupStore.id = props.match.params.id;

    this.getConsignors();
  }

  private async getConsignors() {
    const fulfilees = await AgreementsService.fulfilees();
    this.consignors = fulfilees.filter(f => f instanceof Consignor) as Consignor[];
  }

  private createOrderGroup() {
    if (
      orderGroupStore.name === undefined ||
      orderGroupStore.consignorIds === undefined ||
      orderGroupStore.zipCodes === undefined ||
      orderGroupStore.tags === undefined
    ) {
      orderGroupStore.validateSettings = true;
      return;
    }
    orderGroupStore.settingsLoading = true;
    orderGroupStore.error = undefined;

    OrderGroupService.createOrderGroup(
      orderGroupStore.name,
      orderGroupStore.consignorIds.map(option => option.value),
      orderGroupStore.zipCodes.map(option => option.value),
      orderGroupStore.tags.map(option => option.value)
    )
      .then(response => {
        orderGroupStore.id = response;
        orderGroupStore.settingsLoading = false;
      })
      .catch(error => {
        orderGroupStore.error = error.message;
        orderGroupStore.id = undefined;
        orderGroupStore.settingsLoading = false;
      });
  }

  private resetTimeSlotInputs() {
    orderGroupStore.id = undefined;
    orderGroupStore.deliveryTimeFrom = undefined;
    orderGroupStore.deliveryTimeTo = undefined;
    orderGroupStore.deliveryDayOfWeek = undefined;
    orderGroupStore.executionTime = undefined;
    orderGroupStore.executionDayOfWeek = undefined;
  }

  private createTimeSlot() {
    if (
      orderGroupStore.id === undefined ||
      orderGroupStore.deliveryTimeFrom === undefined ||
      orderGroupStore.deliveryTimeTo === undefined ||
      orderGroupStore.deliveryDayOfWeek === undefined ||
      orderGroupStore.executionTime === undefined ||
      orderGroupStore.executionDayOfWeek === undefined
    ) {
      orderGroupStore.validateTimeSlot = true;
      return;
    }
    orderGroupStore.timeSlotsloading = true;
    orderGroupStore.error = undefined;

    OrderGroupService.addSchedule(
      orderGroupStore.id,
      orderGroupStore.deliveryTimeFrom,
      orderGroupStore.deliveryTimeTo,
      orderGroupStore.deliveryDayOfWeek.value,
      orderGroupStore.executionTime,
      orderGroupStore.executionDayOfWeek.value
    )
      .then(response => {
        orderGroupStore.timeSlots.push(response);
        this.resetTimeSlotInputs();
        orderGroupStore.timeSlotsloading = false;
      })
      .catch(error => {
        orderGroupStore.error = error.message;
        orderGroupStore.id = undefined;
        orderGroupStore.timeSlotsloading = false;
      });
  }

  private renderCreateTimeSlot() {
    var array: JSX.Element[] = [];

    if (orderGroupStore.timeSlots.length !== 0) {
      array.push(
        <div key="timeSlotsCreated" className="c-orderGroup-timeSlotsOuter">
          <h4 className="font-larger c-orderGroup-timeSlots-headline">
            {orderGroupStore.name}
          </h4>
          <div className="c-orderGroup-timeSlots">
            <div className="c-orderGroup-timeSlots-header">
              <p className="font-heading">{Localization.sharedValue("Passage_Route")}</p>
              <p className="font-heading">{Localization.sharedValue("Passage_Driver")}</p>
              <p className="font-heading">{Localization.sharedValue("Passage_Date")}</p>
              <p className="font-heading">
                {Localization.sharedValue("Passage_DepartureTime")}
              </p>
            </div>
            {orderGroupStore.timeSlots.map((timeSlot, index) => {
              return (
                <div
                  key={timeSlot.toString()}
                  onClick={() => this.setState({ selectedPassageIndex: index })}
                  className="c-orderGroup-timeSlot"
                >
                  <p>{timeSlot.deliveryDayOfWeek}</p>
                  <p>{`${timeSlot.deliveryTimeFrom.toString(
                    "hour"
                  )} - ${timeSlot.deliveryTimeTo.toString("hour")}`}</p>
                  <p>{timeSlot.executionDayOfWeek}</p>
                  <p>{timeSlot.executionTime.toString("hour")}</p>
                </div>
              );
            })}
          </div>
          <DividerComponent />
        </div>
      );
    }

    array.push(
      <div key="createTimeSlot" className="c-orderGroup-createTimeSlot">
        <h4 className="font-large c-orderGroup-createTimeSlot-headline">
          Tilføj tidspunkter for gruppen
        </h4>
        <div className="c-orderGroup-createTimeSlot-interval">
          <TimeComponent
            headline="Start"
            placeholder="TT:MM"
            size={"medium"}
            onChange={() => {
              /* */
            }}
            disabled={orderGroupStore.timeSlotsloading}
          />
          <TimeComponent
            headline="Slut"
            placeholder="TT:MM"
            size={"medium"}
            onChange={() => {
              /* */
            }}
            disabled={orderGroupStore.timeSlotsloading}
          />
        </div>
        <Select
          headline="Ugedag for kørsel"
          placeholder="Indtast dag eller vælg fra liste"
          options={Localization.allWeekdays.map(weekday => {
            return { label: weekday.long, value: weekday.number };
          })}
          size={"medium"}
          onSelect={option => {
            if (option) {
              orderGroupStore.deliveryDayOfWeek = option.value;
            } else {
              orderGroupStore.deliveryDayOfWeek = option;
            }
          }}
          disabled={orderGroupStore.timeSlotsloading}
        />
        <div className="c-orderGroup-createTimeSlot-optimizationSettings">
          <TimeComponent
            placeholder="TT:MM"
            headline="Tid for ruteoptimering"
            size={"medium"}
            onChange={() => {
              /* */
            }}
            disabled={orderGroupStore.timeSlotsloading}
          />
          <Select
            headline="Ugedag for kørsel"
            placeholder="Indtast dag eller vælg fra liste"
            options={Localization.allWeekdays.map(weekday => {
              return { label: weekday.long, value: weekday.number };
            })}
            size={"medium"}
            onSelect={option => {
              if (option) {
                orderGroupStore.executionDayOfWeek = option.value;
              } else {
                orderGroupStore.executionDayOfWeek = option;
              }
            }}
            disabled={orderGroupStore.timeSlotsloading}
          />
        </div>
        <ButtonAdd
          onClick={() => this.createTimeSlot()}
          type={ButtonType.Light}
          size={ButtonSize.Medium}
          loading={orderGroupStore.timeSlotsloading}
        />
      </div>
    );

    return array;
  }

  private renderTimeSlotsContainer() {
    if (orderGroupStore.id !== undefined) {
      return this.renderCreateTimeSlot();
    } else {
      return (
        <div className="c-orderGroup-timeSlotsInfo">
          <img
            key="timeSlotsIcon"
            className="c-orderGroup-timeSlots-icon"
            src={require("./assets/timeSlots.svg")}
          />
          <h4
            className="font-larger c-orderGroup-timeSlots-createText"
            key="timeSlotsInfo"
          >
            Opret en ordregruppe og få adgang til at oprette kørselstider
          </h4>
        </div>
      );
    }
  }

  private renderOrderGroupSettings() {
    return (
      <>
        <Input
          placeholder="Indtast navn"
          size={"medium"}
          headline="Gruppens navn"
          onChange={value => (orderGroupStore.name = value)}
          error={
            orderGroupStore.validateSettings &&
            orderGroupStore.name === undefined
          }
          value={orderGroupStore.name}
        />
        <MultiSelectComponent
          placeholder="Eks. 1234 eller 1234-5678"
          size={"medium"}
          addOptionText="Tilføj postnummer"
          headline="Postnumre"
          error={
            orderGroupStore.validateSettings &&
            orderGroupStore.zipCodes === undefined
          }
          values={orderGroupStore.zipCodes}
          onChange={values => {
            if (values) {
              orderGroupStore.zipCodes = values;
            } else {
              orderGroupStore.zipCodes = undefined;
            }
          }}
        />
        <MultiSelectComponent
          placeholder="Vælg specifikationer"
          size={"medium"}
          addOptionText="Tilføj specifikation"
          headline="Leveringsspecifikationer"
          error={
            orderGroupStore.validateSettings &&
            orderGroupStore.tags === undefined
          }
          values={orderGroupStore.tags}
          onChange={values => {
            if (values) {
              orderGroupStore.tags = values;
            } else {
              orderGroupStore.tags = undefined;
            }
          }}
        />
        <MultiSelectComponent
          placeholder="Vælg afsender"
          size={"medium"}
          headline="Vælg afsender"
          options={this.consignors ?
            this.consignors.map(c => ({ label: c.primaryName, value: c.id })) :
            undefined
          }
          error={
            orderGroupStore.validateSettings &&
            orderGroupStore.consignorIds === undefined
          }
          values={orderGroupStore.consignorIds}
          onChange={values => {
            if (values) {
              orderGroupStore.consignorIds = values;
            } else {
              orderGroupStore.consignorIds = undefined;
            }
          }}
        />
        <Button
          onClick={() => this.createOrderGroup()}
          type={ButtonType.Action}
        >
          Opret ordregruppe
        </Button>
      </>
    );
  }

  render() {
    return (
      <div className="c-orderGroup">
        <ContentBox
          className="c-orderGroup-settings"
          title="Sammensæt ordregruppe"
        >
          {this.renderOrderGroupSettings()}
        </ContentBox>
        <ContentBox
          className="c-orderGroup-timeSlotsContainer"
          title="Kørselstider for ordregruppen"
        >
          {this.renderTimeSlotsContainer()}
        </ContentBox>
      </div>
    );
  }
}
