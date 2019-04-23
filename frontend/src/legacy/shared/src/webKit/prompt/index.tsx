import React from "react";
import "./styles.scss";

export interface PromptProps {
  headline: String;
  subtitle: String;
  buttons?: JSX.Element[];
  remove();
}

export default class Prompt extends React.Component<PromptProps> {
  constructor(props: PromptProps) {
    super(props);
  }

  render() {
    return (
      <div className="promptOuterContainer">
        <div className="textContainer">
          <div className="font-larger headline">{this.props.headline}</div>
          <div className="font-larger subtitle">{this.props.subtitle}</div>
        </div>
        <div className="buttonsOuterContainer">{this.props.buttons}</div>
        <img
          className="close"
          onClick={() => this.props.remove()}
          src={require("../assets/images/buttons/closeDark.svg")}
        />
      </div>
    );
  }
}
