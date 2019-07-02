import React from "react";
import "./styles.scss";

interface Props {
  title: string;
  // tslint:disable-next-line:no-any
  image: any;
}

export default class InfoComponent extends React.Component<Props> {
  render() {
    return (
      <div className="c-infoView">
        <div>
          <img src={this.props.image} />
          <div className="font-large">{this.props.title}</div>
        </div>
      </div>
    );
  }
}
