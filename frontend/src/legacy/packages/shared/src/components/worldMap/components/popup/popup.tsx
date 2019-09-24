import React from "react";
import { InfoWindow, InfoWindowProps } from "react-google-maps";
import "./popup.scss";

export interface PopupProps extends InfoWindowProps {
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  options: PopupOptions;
}

export interface PopupOptions extends google.maps.InfoWindowOptions {
  // TODO: Not yet implemented.
  disableCloseButton?: boolean;
}

/**
 * Represents a popup shown when a marker on a map is clicked or hovered over.
 */
export class Popup extends React.Component<PopupProps> {

  /**
   * Renders the component.
   */
  public render() {

    return (
      <InfoWindow {...this.props as InfoWindowProps}>
        <div
          className="c-worldMap-popup"
          onMouseOver={() => this.props.onMouseOver && this.props.onMouseOver()}
          onMouseOut={() => this.props.onMouseOut && this.props.onMouseOut()}
        >
          {this.props.children}
        </div>
      </InfoWindow>);
  }
}
