import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
import {
  DynamicPriceStore,
  DynamicPricePage
} from "./cleanup/dynamicPrices/dynamicPriceIndex";

import Templates from "./templates";
import Rule from "./rule";
import Terms from "./terms";
import { Button, ButtonType } from "shared/src/webKit";

@observer
export default class DynamicPrice extends React.Component {
  store = new DynamicPriceStore();

  renderPage() {
    // tslint:disable-next-line:switch-default
    switch (this.store.page) {
      case DynamicPricePage.Templates:
        return <Templates store={this.store} />;
      case DynamicPricePage.Terms:
        return <Terms store={this.store} />;
      case DynamicPricePage.Rules:
        return <Rule store={this.store} />;
    }
  }

  continue() {
    // tslint:disable-next-line:switch-default
    switch (this.store.page) {
      case DynamicPricePage.Templates:
        this.store.selectedTemplate = true;
        break;
      case DynamicPricePage.Terms:
        alert("missing...");
        break;
      case DynamicPricePage.Rules:
        this.store.selectedRules = true;
        break;
    }
  }

  goBack() {
    // tslint:disable-next-line:switch-default
    switch (this.store.page) {
      case DynamicPricePage.Templates:
        break;
      case DynamicPricePage.Terms:
        this.store.selectedRules = false;
        break;
      case DynamicPricePage.Rules:
        this.store.selectedTemplate = false;
        break;
    }
  }

  disabledContinueButton(): boolean {
    // tslint:disable-next-line:switch-default
    switch (this.store.page) {
      case DynamicPricePage.Templates:
        return this.store.template === undefined;
      case DynamicPricePage.Terms:
        return false;
      case DynamicPricePage.Rules:
        if (this.store.rules && this.store.rules.items.length) {
          return false;
        }
        break;
    }

    return true;
  }

  render() {
    return (
      <div className="c-dynamicPriceContainer">
        <div className="font-larger primary light">
          {DynamicPricePage.title(this.store.page)}
        </div>
        <div className="c-dynamicPriceContainer-description font-small primary light">
          {DynamicPricePage.description(this.store.page)}
        </div>
        <div className="c-dynamicPriceContainer-contentContainer">
          {this.renderPage()}
        </div>
        <div className="c-dynamicPriceContainer-priceButtonOuterContainer">
          <div className="c-dynamicPriceContainer-priceButtonContainer">
            {this.store.canGoBack && (
              <Button onClick={() => this.goBack()} type={ButtonType.Neutral}>
                Gå tilbage
              </Button>
            )}
            <Button
              onClick={() => this.continue()}
              type={ButtonType.Action}
              disabled={this.disabledContinueButton()}
            >
              {DynamicPricePage.continueTitle(this.store.page)}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
