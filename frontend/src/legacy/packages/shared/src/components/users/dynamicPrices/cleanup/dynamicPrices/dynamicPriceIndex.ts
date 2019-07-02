import { observable, computed } from "mobx";
import { DynamicPriceTemplate } from "./enums/dynamicPriceTemplate";
import { SinglePriceStore } from "./dynamicPriceRule";

export enum DynamicPricePage {
  Templates,
  Rules,
  Terms
}

export namespace DynamicPricePage {
  export function title(
    type: DynamicPricePage,
    template?: DynamicPriceTemplate
  ): string {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case DynamicPricePage.Templates:
        return "Vælg skabelon";
      case DynamicPricePage.Rules:
        let returnTitle = "Indskriv regler";

        if (template) {
          returnTitle += " (" + DynamicPriceTemplate.title(template) + ")";
        }

        return returnTitle;
      case DynamicPricePage.Terms:
        return "Betingelser";
    }
  }

  export function description(type: DynamicPricePage): string {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case DynamicPricePage.Templates:
        // tslint:disable-next-line:max-line-length
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut diam ac justo eleifend ultrices.";
      case DynamicPricePage.Rules:
        // tslint:disable-next-line:max-line-length
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut diam ac justo eleifend ultrices.";
      case DynamicPricePage.Terms:
        // tslint:disable-next-line:max-line-length
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut diam ac justo eleifend ultrices.";
    }
  }

  export function continueTitle(type: DynamicPricePage): string {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case DynamicPricePage.Templates:
        return "Vælg skabelon";
      case DynamicPricePage.Rules:
        return "Godkend regler";
      case DynamicPricePage.Terms:
        return "Opret og godkend betingelser";
    }
  }
}

export class DynamicPriceStore {
  @observable selectedTemplate: boolean = false;
  @observable selectedRules: boolean = false;

  @observable template?: DynamicPriceTemplate;

  @observable rules?: SinglePriceStore;

  @computed
  public get page(): DynamicPricePage {
    if (this.selectedRules && this.selectedTemplate) {
      return DynamicPricePage.Terms;
    } else if (this.selectedTemplate) {
      return DynamicPricePage.Rules;
    }

    return DynamicPricePage.Templates;
  }

  @computed
  public get canGoBack(): boolean {
    return this.selectedTemplate;
  }
}
