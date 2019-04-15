import React from "react";
import "./style.scss";
import ThreeDotsAnimated from "../threeDotsAnimated";

export interface MAnimatedProps {
  title?: string;
  description?: string;
}

export default class LoadingInline extends React.Component<MAnimatedProps> {
  render() {
    return (
      <div className="loadingOuterContainer">
        <div className="loadingContainer">
          <ThreeDotsAnimated small={false} light={false} className="image" />
          {this.props.title &&
            <div className="textContainer">
              <div className="font-larger">{this.props.title}</div>
              {this.props.description && (
                <div className="text font-base">{this.props.description}</div>
              )}
            </div>
          }
        </div>
      </div>
    );
  }
}
