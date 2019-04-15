import { observable } from "mobx";

export enum DynamicPriceTermsStart {
  Immediately,
  SpecificDate
}

export enum DynamicPriceTermsStops {
  All,
  Custom
}

export class DynamicPriceTerms {
  @observable
  start: DynamicPriceTermsStart = DynamicPriceTermsStart.Immediately;

  @observable stops: DynamicPriceTermsStops = DynamicPriceTermsStops.All;
}
