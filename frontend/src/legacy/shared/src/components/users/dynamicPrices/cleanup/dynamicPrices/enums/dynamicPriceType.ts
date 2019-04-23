import { SingleRule } from "../dynamicPriceRule";
export enum DynamicPriceType {
  MinimumPrice,
  StartPrice,
  AdditionalKmPrice,
  ExtraPriceStops,
  Zones,
  ZonesPriceKmOver,
  LoadingPrice,
  LoadingInclusive,
  LoadingInclusivePickup,
  LoadingInclusiveDelivery,
  PriceEachKm,
  TimeInterval,
  HourPrice
}

export namespace DynamicPriceType {
  export function canCalculateWithEstimate(
    rule: SingleRule,
    rules: SingleRule[]
  ): boolean {
    // tslint:disable-next-line:switch-default
    switch (rule.type) {
      case DynamicPriceType.Zones:
        // Only return true for the first one - they all calculate as zone 1
        let foundRule = false;
        for (let tempRule of rules) {
          if (foundRule === false && tempRule.id === rule.id) {
            return true;
          }

          if (tempRule.type === DynamicPriceType.Zones) {
            foundRule = true;
          }
        }

        return false;
      case DynamicPriceType.MinimumPrice:
        return false;
      case DynamicPriceType.StartPrice:
        return false;
      case DynamicPriceType.AdditionalKmPrice:
        return true;
      case DynamicPriceType.ExtraPriceStops:
        return false;
      case DynamicPriceType.ZonesPriceKmOver:
        return false;
      case DynamicPriceType.LoadingPrice:
        return false;
      case DynamicPriceType.LoadingInclusive:
        return true;
      case DynamicPriceType.LoadingInclusivePickup:
        return true;
      case DynamicPriceType.LoadingInclusiveDelivery:
        return true;
      case DynamicPriceType.PriceEachKm:
        return true;
      case DynamicPriceType.TimeInterval:
        return false;
      case DynamicPriceType.HourPrice:
        return true;
    }
  }

  export function allowedToAdd(
    type: DynamicPriceType,
    rules: SingleRule[]
  ): boolean {
    if (limitedBy(type, rules)) {
      return false;
    }

    let count = 0;
    rules.forEach(rule => {
      if (rule.type === type) {
        count++;
      }
    });

    if (count > 0 && allowedOnlyOnce(type)) {
      return false;
    }

    return true;
  }

  export function limitedBy(
    type: DynamicPriceType,
    rules: SingleRule[]
  ): boolean {
    let currentTypes = rules.map(rule => rule.type);

    // tslint:disable-next-line:switch-default
    switch (type) {
      case DynamicPriceType.Zones:
        return (
          DynamicPriceType.PriceEachKm in currentTypes ||
          DynamicPriceType.HourPrice in currentTypes
        );
      case DynamicPriceType.StartPrice:
        return DynamicPriceType.HourPrice in currentTypes;
      case DynamicPriceType.PriceEachKm:
        return (
          DynamicPriceType.HourPrice in currentTypes ||
          DynamicPriceType.Zones in currentTypes
        );
      case DynamicPriceType.HourPrice:
        return (
          DynamicPriceType.MinimumPrice in currentTypes ||
          DynamicPriceType.StartPrice in currentTypes ||
          DynamicPriceType.PriceEachKm in currentTypes ||
          DynamicPriceType.Zones in currentTypes
        );

      case DynamicPriceType.MinimumPrice:
        return false;
      case DynamicPriceType.ExtraPriceStops:
        return false;
      case DynamicPriceType.AdditionalKmPrice:
        return false;
      case DynamicPriceType.TimeInterval:
        return false;
      case DynamicPriceType.LoadingPrice:
        return false;
      case DynamicPriceType.LoadingInclusive:
        return (
          DynamicPriceType.LoadingInclusivePickup in currentTypes ||
          DynamicPriceType.LoadingInclusiveDelivery in currentTypes
        );
      case DynamicPriceType.LoadingInclusivePickup:
        return DynamicPriceType.LoadingInclusive in currentTypes;
      case DynamicPriceType.LoadingInclusiveDelivery:
        return DynamicPriceType.LoadingInclusive in currentTypes;
      case DynamicPriceType.ZonesPriceKmOver:
        return false;
    }
  }

  export function allowedOnlyOnce(type: DynamicPriceType): boolean {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case DynamicPriceType.Zones:
        return false;
      case DynamicPriceType.MinimumPrice:
        return true;
      case DynamicPriceType.StartPrice:
        return true;
      case DynamicPriceType.AdditionalKmPrice:
        return true;
      case DynamicPriceType.ExtraPriceStops:
        return true;
      case DynamicPriceType.ZonesPriceKmOver:
        return true;
      case DynamicPriceType.LoadingPrice:
        return true;
      case DynamicPriceType.LoadingInclusive:
        return true;
      case DynamicPriceType.LoadingInclusivePickup:
        return true;
      case DynamicPriceType.LoadingInclusiveDelivery:
        return true;
      case DynamicPriceType.PriceEachKm:
        return true;
      case DynamicPriceType.TimeInterval:
        return true;
      case DynamicPriceType.HourPrice:
        return true;
    }
  }

  export function title(type: DynamicPriceType): string {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case DynamicPriceType.MinimumPrice:
        return "Minimumspris";
      case DynamicPriceType.StartPrice:
        return "Startpris";
      case DynamicPriceType.AdditionalKmPrice:
        return "Kilometer tillæg";
      case DynamicPriceType.ExtraPriceStops:
        return "Pris pr. ekstra stop";
      case DynamicPriceType.Zones:
        return "Zonepris";
      case DynamicPriceType.ZonesPriceKmOver:
        return "Kilometer pris udover zoner";
      case DynamicPriceType.LoadingPrice:
        return "Læssetids pris";
      case DynamicPriceType.LoadingInclusive:
        return "Læssetid";
      case DynamicPriceType.LoadingInclusivePickup:
        return "Afhentnings læssetid";
      case DynamicPriceType.LoadingInclusiveDelivery:
        return "Leverings læssetid";
      case DynamicPriceType.PriceEachKm:
        return "Pris pr. kilimeter";
      case DynamicPriceType.TimeInterval:
        return "Tids interval";
      case DynamicPriceType.HourPrice:
        return "Pris pr. time";
    }
  }

  export function description(type: DynamicPriceType): string {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case DynamicPriceType.MinimumPrice:
        return "Hvad skal turen minimum koste?";
      case DynamicPriceType.StartPrice:
        return "Hvad koster turen i opstart";
      case DynamicPriceType.AdditionalKmPrice:
        return "Hvor meget skal chaufføren have ekstra efter x kilometer";
      case DynamicPriceType.ExtraPriceStops:
        return "Ekstra betaling ved flere stops";
      case DynamicPriceType.Zones:
        return "Insæt en zone";
      case DynamicPriceType.ZonesPriceKmOver:
        return "Hvis der køres udover zonen";
      case DynamicPriceType.LoadingPrice:
        return "Prisen for hvert læssetids minut";
      case DynamicPriceType.LoadingInclusive:
        return "Hvor meget gratis læssetid er med?";
      case DynamicPriceType.LoadingInclusivePickup:
        return "Hvor meget gratis læssetid er med ved afhentning?";
      case DynamicPriceType.LoadingInclusiveDelivery:
        return "Hvor meget gratis læssetid er med ved levering?";
      case DynamicPriceType.PriceEachKm:
        return "Definer prisen for hvert kørt kilometer";
      case DynamicPriceType.TimeInterval:
        return "Inden for hvilken tid skal dette være aktivt?";
      case DynamicPriceType.HourPrice:
        return "Hvor meget skal chaufføren have i timen?";
    }
  }
}
