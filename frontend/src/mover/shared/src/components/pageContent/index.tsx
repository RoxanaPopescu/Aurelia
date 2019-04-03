import React from "react";
import { observer } from "mobx-react";
import "./styles.scss";

interface Props {
  className?: string;
}
/**
 * Represents the content of a page.
 */
@observer
export class PageContentComponent extends React.Component<Props> {

  public render() {
    return (
      <div className="pageContent">
        <div className={`pageContent-content ${this.props.className || ""}`}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
