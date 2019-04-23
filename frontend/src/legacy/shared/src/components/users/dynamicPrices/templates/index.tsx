import React from "react";
import "./styles.scss";
import { DynamicPriceStore } from "../cleanup/dynamicPrices/dynamicPriceIndex";
import { observer } from "mobx-react";
import { DynamicPriceTemplate } from "../cleanup/dynamicPrices/enums/dynamicPriceTemplate";

interface Props {
  store: DynamicPriceStore;
}

@observer
export default class Templates extends React.Component<Props> {
  templateImage(type: DynamicPriceTemplate) {
    // tslint:disable-next-line:switch-default
    switch (type) {
      case DynamicPriceTemplate.Zones:
        return this.props.store.template === type
          ? require("./assets/zones_selected.svg")
          : require("./assets/zones.svg");
      case DynamicPriceTemplate.AdHoc:
        return this.props.store.template === type
          ? require("./assets/adhoc_selected.svg")
          : require("./assets/adhoc.svg");
      case DynamicPriceTemplate.Hour:
        return this.props.store.template === type
          ? require("./assets/hour_selected.svg")
          : require("./assets/hour.svg");
      case DynamicPriceTemplate.None:
        return;
    }
  }

  renderItem(type: DynamicPriceTemplate) {
    let classNames = "c-templatesContainer-templateItem";
    if (this.props.store.template === type) {
      classNames += " c-templatesContainer-selected";
    }

    let image = this.templateImage(type);
    classNames += image
      ? " c-templatesContainer-templateImage"
      : " c-templatesContainer-templateText";

    return (
      <div
        className={classNames}
        onClick={() => (this.props.store.template = type)}
      >
        {image && <img className="c-templatesContainer-image" src={image} />}
        <div className="c-templatesContainer-title font-larger">
          {DynamicPriceTemplate.title(type)}
        </div>
        <div>{DynamicPriceTemplate.description(type)}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="singlePriceTemplate">
        <div className="c-templatesContainer">
          {this.renderItem(DynamicPriceTemplate.Zones)}
          {this.renderItem(DynamicPriceTemplate.AdHoc)}
          {this.renderItem(DynamicPriceTemplate.Hour)}
          {this.renderItem(DynamicPriceTemplate.None)}
        </div>
      </div>
    );
  }
}
