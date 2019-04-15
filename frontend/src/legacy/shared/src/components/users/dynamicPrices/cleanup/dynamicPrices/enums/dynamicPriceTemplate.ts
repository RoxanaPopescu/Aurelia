import { DynamicPriceType } from "./dynamicPriceType";

export enum DynamicPriceTemplate {
  Zones,
  AdHoc,
  Hour,
  None
}

export namespace DynamicPriceTemplate {
  export function rules(type: DynamicPriceTemplate): DynamicPriceType[] {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case DynamicPriceTemplate.Zones:
        return [
          DynamicPriceType.LoadingPrice,
          DynamicPriceType.LoadingInclusive,
          DynamicPriceType.Zones,
          DynamicPriceType.Zones,
          DynamicPriceType.Zones
        ];
      case DynamicPriceTemplate.AdHoc:
        return [
          DynamicPriceType.StartPrice,
          DynamicPriceType.PriceEachKm,
          DynamicPriceType.MinimumPrice,
          DynamicPriceType.LoadingPrice,
          DynamicPriceType.LoadingInclusive
        ];
      case DynamicPriceTemplate.Hour:
        return [
          DynamicPriceType.StartPrice,
          DynamicPriceType.MinimumPrice,
          DynamicPriceType.HourPrice,
          DynamicPriceType.LoadingPrice,
          DynamicPriceType.LoadingInclusive
        ];
      case DynamicPriceTemplate.None:
        return [];
    }
  }

  export function title(type: DynamicPriceTemplate): string {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case DynamicPriceTemplate.Zones:
        return "Zonepriser";
      case DynamicPriceTemplate.AdHoc:
        return "Ad-hoc priser";
      case DynamicPriceTemplate.Hour:
        return "Timepriser";
      case DynamicPriceTemplate.None:
        return "Tom skabelon";
    }
  }

  export function description(type: DynamicPriceTemplate): string {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case DynamicPriceTemplate.Zones:
        // tslint:disable-next-line:max-line-length
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut diam ac justo eleifend ultrices.";
      case DynamicPriceTemplate.AdHoc:
        // tslint:disable-next-line:max-line-length
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut diam ac justo eleifend ultrices.";
      case DynamicPriceTemplate.Hour:
        // tslint:disable-next-line:max-line-length
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut diam ac justo eleifend ultrices.";
      case DynamicPriceTemplate.None:
        // tslint:disable-next-line:max-line-length
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut diam ac justo eleifend ultrices.";
    }
  }
}
