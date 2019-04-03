import React from "react";
import "./styles.scss";

export interface Props {
  color?: string;
  headline: string;
  rows: { headline: string; value: string }[];
  actionText?: string;
  actionClick?();
}

export default class InfoBox extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className="c-infoBox">
        <div
          style={{ backgroundColor: this.props.color }}
          className="c-infoBox-headline cta4"
        >
          {this.props.headline}
        </div>
        {this.props.children !== undefined && (
          <div className="c-infoBox-children">{this.props.children}</div>
        )}
        <div className="c-infoBox-rows">
          {this.props.rows.map(row => {
            return (
              <div className="c-infoBox-row" key={row.headline + row.value}>
                <div className="c-infoBox-row-headline list2">
                  {row.headline}
                </div>
                <div className="c-infoBox-row-value list1">{row.value}</div>
              </div>
            );
          })}
        </div>
        {this.props.actionText !== undefined && (
          <div
            className="cta3 c-infoBox-actionLink"
            onClick={() => {
              if (this.props.actionClick) {
                this.props.actionClick();
              }
            }}
          >
            {this.props.actionText}
          </div>
        )}
      </div>
    );
  }
}
