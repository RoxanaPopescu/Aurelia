import { observable } from "mobx";
import { GUID } from "shared/src/utillity/guid";

export enum DynamicPriceComponentType {
  Enum,
  Table,
  Input
}

export enum DynamicPriceInputType {
  WholeNumber,
  Decimal,
  String,
  Time
}

export interface DynamicPriceValue {
  label: string;
  value: string;
}

export class DynamicPriceTable {
  components: DynamicPriceComponent[] = [];

  copy(): DynamicPriceTable {
    let priceTable = new DynamicPriceTable();

    for (let component of this.components) {
      priceTable.components.push(component.copy());
    }

    return priceTable;
  }
}

export const inputContent = new Map<string, string>();

export class DynamicPriceComponent {
  type: DynamicPriceComponentType;
  guid = GUID.generate();
  inputType: DynamicPriceInputType;
  id: string;
  label: string; // Placeholder?
  valueDescription?: string;
  sentence?: string;
  allowedValues: DynamicPriceValue[];
  @observable
  subComponents: DynamicPriceTable[] = [];
  subComponentsSortIndex = 0;

  constructor(
    type: DynamicPriceComponentType,
    label: string,
    id: string,
    allowedValues: DynamicPriceValue[] = [],
    sentence?: string,
    valueDescription?: string
  ) {
    this.type = type;
    this.inputType = DynamicPriceInputType.String;
    this.label = label;
    this.sentence = sentence;
    this.id = id;
    this.allowedValues = allowedValues;
    this.valueDescription = valueDescription;
  }

  addSubComponent(component: DynamicPriceTable) {
    this.subComponents.push(component);
    this.subComponents = this.subComponents.sort((n1, n2) => {
      let priceComponentOne = n1.components[this.subComponentsSortIndex];
      let priceComponentTwo = n2.components[this.subComponentsSortIndex];
      let valueOne = inputContent[priceComponentOne.guid];
      let valueTwo = inputContent[priceComponentTwo.guid];

      let valueOneNumber = Number(valueOne);
      let valueTwoNumber = Number(valueTwo);

      if (valueOneNumber && valueTwoNumber) {
        if (valueOneNumber > valueTwoNumber) {
          return 1;
        }

        if (valueOneNumber <= valueTwoNumber) {
          return -1;
        }
      }

      return 0;
    });
  }

  removeSubComponent(index: number) {
    this.subComponents.splice(index, 1);
  }

  copy(): DynamicPriceComponent {
    return new DynamicPriceComponent(
      this.type,
      this.label,
      this.id,
      this.allowedValues,
      this.sentence,
      this.valueDescription
    );
  }
}

export class DynamicPrice {
  title: string;
  description: string;
  id: string;
  multipleAllowed: boolean;
  sentence?: string;
  components: DynamicPriceComponent[];

  constructor(type: number) {
    if (type === 0) {
      this.multipleAllowed = true; // FIXME: REMOVE THIS!!!
      this.id = "zone-prices";
      this.title = "Zone priser";
      // tslint:disable-next-line:max-line-length
      this.description =
        "Definer zone priser ud fra aktuel eller estimeret beregning. Tilføj alle zone priser.";

      let components: DynamicPriceComponent[] = [];

      let values: DynamicPriceValue[] = [
        { label: "Estimeret beregning", value: GUID.generate() },
        { label: "Aktuel beregning", value: GUID.generate() }
      ];

      let selectComponent = new DynamicPriceComponent(
        DynamicPriceComponentType.Enum,
        "Beregningstype",
        "0id",
        values,
        "for zone op til"
      );
      components.push(selectComponent);

      let zonesComponent = new DynamicPriceComponent(
        DynamicPriceComponentType.Table,
        "Zoner",
        "44id",
        [],
        "Herefter koster det"
      );

      let content = new DynamicPriceTable();
      content.components.push(
        new DynamicPriceComponent(
          DynamicPriceComponentType.Input,
          "Kilometer",
          "31id",
          [],
          "koster det",
          "km."
        )
      );

      content.components.push(
        new DynamicPriceComponent(
          DynamicPriceComponentType.Input,
          "Pris",
          "32id",
          [],
          undefined,
          "kr."
        )
      );

      zonesComponent.subComponents.push(content);
      components.push(zonesComponent);

      components.push(
        new DynamicPriceComponent(
          DynamicPriceComponentType.Input,
          "Pris pr / km",
          "2id",
          [],
          undefined,
          "kr./km."
        )
      );

      this.components = components;
    } else if (type === 1) {
      this.multipleAllowed = false;
      this.id = "minimum-price";
      this.title = "Minimumspris";
      this.description = "Definér den absolutte minimumspris for hele ruten.";

      let components: DynamicPriceComponent[] = [];
      components.push(
        new DynamicPriceComponent(
          DynamicPriceComponentType.Input,
          "Pris i kr.",
          "2id",
          [],
          undefined,
          "kr."
        )
      );
      this.components = components;
    } else if (type === 2) {
      this.multipleAllowed = true;
      this.id = "supplement-time";
      this.title = "Læssetid";
      this.description = `Definér hvor meget læssetid der skal tilføjes pr. stop. 
            Der kan tilføjes gratis minutter`;

      let components: DynamicPriceComponent[] = [];

      let values: DynamicPriceValue[] = [
        { label: "Estimeret beregning", value: GUID.generate() },
        { label: "Aktuel beregning", value: GUID.generate() }
      ];

      let selectComponent = new DynamicPriceComponent(
        DynamicPriceComponentType.Enum,
        "Beregningstype",
        "0id",
        values,
        "ved"
      );
      components.push(selectComponent);

      let valuesStopStype: DynamicPriceValue[] = [
        { label: "Afhentning og levering", value: GUID.generate() },
        { label: "Afhentning", value: GUID.generate() },
        { label: "Levering", value: GUID.generate() }
      ];

      let stopTypeComponent = new DynamicPriceComponent(
        DynamicPriceComponentType.Enum,
        "Stop type",
        "4id",
        valuesStopStype,
        "koster det"
      );
      components.push(stopTypeComponent);
      components.push(
        new DynamicPriceComponent(
          DynamicPriceComponentType.Input,
          "Pris pr. minut",
          "2id",
          [],
          "Vi giver",
          "kr./min."
        )
      );
      components.push(
        new DynamicPriceComponent(
          DynamicPriceComponentType.Input,
          "Antal minutter",
          "1id",
          [],
          "gratis pr. stop",
          "min."
        )
      );

      this.components = components;
    } else {
      this.multipleAllowed = true;
      this.id = "extra-stop";
      this.title = "Pris pr. ekstra stop";
      this.description = "Definér prisen pr. stop efter x-antal stops.";
      this.sentence = "Efter";

      let components: DynamicPriceComponent[] = [];

      components.push(
        new DynamicPriceComponent(
          DynamicPriceComponentType.Input,
          "Stop nummer",
          "1id",
          [],
          "koster det yderligere",
          "stop"
        )
      );
      components.push(
        new DynamicPriceComponent(
          DynamicPriceComponentType.Input,
          "Pris pr. stop",
          "2id",
          [],
          undefined,
          "kr./stop"
        )
      );

      this.components = components;
    }
  }
}

export class Prices {
  prices: DynamicPrice[] = [
    new DynamicPrice(0),
    new DynamicPrice(1),
    new DynamicPrice(2),
    new DynamicPrice(3)
  ];
}
