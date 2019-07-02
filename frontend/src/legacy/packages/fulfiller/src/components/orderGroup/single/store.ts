import { observable } from "mobx";
import { OptionValue } from "react-selectize";
import { TimeOfDay } from "shared/src/model/general/timeOfDay";
import { TimeSlot } from "./models/timeSlot";

export class OrderGroupStore {
  @observable
  error?: string;
  @observable
  id?: string;

  /*
  ** Settings
  */
  @observable
  settingsLoading: boolean = false;
  @observable
  validateSettings: boolean = false;
  @observable
  name?: string;
  @observable
  consignorIds?: OptionValue[];
  @observable
  zipCodes?: OptionValue[];
  @observable
  tags?: OptionValue[];

  /*
  ** Time slots
  */
  @observable
  timeSlotsloading: boolean = false;
  @observable
  validateTimeSlot: boolean = false;
  @observable
  deliveryTimeFrom?: TimeOfDay;
  @observable
  deliveryTimeTo?: TimeOfDay;
  @observable
  deliveryDayOfWeek?: OptionValue;
  @observable
  executionTime?: TimeOfDay;
  @observable
  executionDayOfWeek?: OptionValue;
  @observable
  timeSlots: TimeSlot[] = [];
}
