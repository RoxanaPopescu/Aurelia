import React from "react";
import "./styles.scss";
import { Button, ButtonType } from "shared/src/webKit";
import { SinglePriceStore } from "../../cleanup/dynamicPrices/dynamicPriceRule";
import { DynamicPriceType } from "../../cleanup/dynamicPrices/enums/dynamicPriceType";

interface Props {
  store: SinglePriceStore;
}

export default class AddRule extends React.Component<Props> {
  close() {
    this.props.store.addingRule = false;
    this.props.store.selectedRule = undefined;
  }

  renderRule(type: DynamicPriceType, index: number) {
    let className = "c-addRuleOuterContainer-rule";
    if (DynamicPriceType.allowedToAdd(type, this.props.store.items) === false) {
      className += " c-addRuleOuterContainer-disabledRule";
    }

    return (
      <div
        className={className}
        key={index}
        onClick={() => {
          this.props.store.addRule(type);
          this.close();
        }}
      >
        <div>{DynamicPriceType.title(type)}</div>
        <div>{DynamicPriceType.description(type)}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="c-addRuleOuterContainer">
        <div className="c-addRuleOuterContainer-addRule">
          <div className="c-addRuleOuterContainer-title font-larger">
            {this.props.store.selectedRule ? "Ændre regel" : "Tilføj regel"}
          </div>
          {this.props.store.rulesToAdd.map((type, index) =>
            this.renderRule(type, index)
          )}
          <div className="c-addRuleOuterContainer-bottomBar">
            {this.props.store.selectedRule && (
              <Button
                onClick={() =>
                  this.props.store.removeRule(this.props.store.selectedRule!)
                }
                type={ButtonType.Neutral}
              >
                Fjern denne regel
              </Button>
            )}
            <Button
              onClick={() => this.close()}
              type={ButtonType.Action}
            >
              Luk
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
