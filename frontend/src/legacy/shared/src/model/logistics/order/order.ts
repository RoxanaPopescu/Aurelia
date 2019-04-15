import moment from "moment";
import { Collo, State } from "./";
import Consignor from "shared/src/model/_cleanup/consignor";
import Consignee from "shared/src/model/_cleanup/consignee";
import { Journey } from "./journey";
import { observable } from "mobx";
import { Location } from "shared/src/model/general/location";

export class Order {
  public internalOrderId: string;
  public publicOrderId: string;
  public consignor: Consignor;
  public consignee: Consignee;
  public date: moment.Moment;
  public pickupTimeframe: Timeframe;
  public pickupInstructions?: string;
  public deliveryTimeframe: Timeframe;
  public deliveryInstructions?: string;
  public estimatedColli: Collo[];
  public actualColli: Collo[];
  public numberOfCollis: number;
  public state: State;
  public journey?: Journey;
  public fulfillerId: string;

  /**
   * True if the route may be assigned to a fulfiller or driver,
   * otherwise false.
   */
  @observable public allowAssignment: boolean;

  // tslint:disable-next-line:no-any
  constructor(json: any) {
    this.internalOrderId = json.internalOrderId;
    this.publicOrderId = json.consignorOrderId;
    this.consignor = new Consignor(
      json.consingorName,
      json.consignorPhoneNumber,
      new Location({
        address: {
          primary: json.pickupLocation.address,
          secondary: ""
        },
        position: json.pickupLocation.position
      }),
      json.consignorId
    );
    this.consignee = new Consignee(
      json.consigneeName,
      json.consigneeCompanyName,
      json.consigneePhoneNumber,
      new Location({
        address: {
          primary: json.deliveryLocation.address,
          secondary: ""
        },
        position: json.deliveryLocation.position
      })
    );
    this.date = moment(json.pickupAppointment.earliestArrivalDate);
    this.pickupTimeframe = new Timeframe({
      dateFrom: json.pickupAppointment.earliestArrivalDate,
      dateTimeFrom: json.pickupAppointment.earliestArrivalTime,
      dateTo: json.pickupAppointment.latestArrivalDate,
      dateTimeTo: json.pickupAppointment.latestArrivalTime
    });
    this.pickupInstructions = json.pickupInstructions;
    this.deliveryTimeframe = new Timeframe({
      dateFrom: json.deliveryAppointment.earliestArrivalDate,
      dateTimeFrom: json.deliveryAppointment.earliestArrivalTime,
      dateTo: json.deliveryAppointment.latestArrivalDate,
      dateTimeTo: json.deliveryAppointment.latestArrivalTime
    });
    this.deliveryInstructions = json.deliveryInstructions;
    this.estimatedColli = json.estimatedColli.map(collo => new Collo(collo));
    this.actualColli = json.actualColli.map(collo => new Collo(collo));
    this.state = new State(json.state);
    this.allowAssignment = json.allowAssignment;
    this.fulfillerId = json.fulfillerId;
  }
}

export class Timeframe {
  dateTimeFrom?: moment.Moment;
  dateTimeTo?: moment.Moment;

  // tslint:disable-next-line:no-any
  constructor(json: any) {
    this.dateTimeFrom = moment(json.dateFrom).set({
      hour: Number(json.dateTimeFrom.split(":")[0]),
      minute: Number(json.dateTimeFrom.split(":")[1])
    });
    this.dateTimeTo = moment(json.dateTo).set({
      hour: Number(json.dateTimeTo.split(":")[0]),
      minute: Number(json.dateTimeTo.split(":")[1])
    });
  }

  public get formatted(): string {
    let formattedString = "";
    if (this.dateTimeFrom) {
      formattedString += this.dateTimeFrom.format("HH:mm") + " - ";
      if (this.dateTimeTo) {
        formattedString += this.dateTimeTo.format("HH:mm");
      }
    } else {
      if (this.dateTimeTo) {
        formattedString += "- " + this.dateTimeTo.format("HH:mm");
      } else {
        formattedString += "--";
      }
    }
    return formattedString;
  }
}
