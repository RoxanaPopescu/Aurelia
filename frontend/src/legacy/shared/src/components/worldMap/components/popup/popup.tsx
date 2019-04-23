import React from "react";
import { InfoWindow, InfoWindowProps } from "react-google-maps";
import "./popup.scss";

let remainingFixAttempts = 0;

export interface PopupProps extends InfoWindowProps {
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  options: PopupOptions;
}

export interface PopupOptions extends google.maps.InfoWindowOptions {
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

    if (remainingFixAttempts > 0) {
      remainingFixAttempts = 180;
    } else {
      remainingFixAttempts = 180;
      this.fixInfoWindow();
    }

    return (
      <InfoWindow {...this.props as InfoWindowProps}>
        <div
          className="c-worldMap-popup-content"
          onMouseOver={() => this.props.onMouseOver && this.props.onMouseOver()}
          onMouseOut={() => this.props.onMouseOut && this.props.onMouseOut()}
        >
          {this.props.children}
        </div>
      </InfoWindow>);
  }

  /**
   * Applies class names to the elements of the native Info Window,
   * thereby allowing custom styles to be applied.
   */
  private fixInfoWindow(): void {

    const disableCloseButton = this.props.options && this.props.options.disableCloseButton != null
      ? this.props.options.disableCloseButton
      : false;

    const worldMapElements = document.getElementsByClassName("c-worldMap");
    for (let i = 0; i < worldMapElements.length; i++) {
      const worldMapElement = worldMapElements[i];

      const infoWindowElements = worldMapElement.getElementsByClassName("gm-style-iw");
      for (let j = 0; j < infoWindowElements.length; j++) {
        const infoWindowElement = infoWindowElements[j];

        infoWindowElement.classList.add("c-worldMap-popup");

        if (infoWindowElement.previousElementSibling) {
          infoWindowElement.previousElementSibling!.classList.add("c-worldMap-popup-window");
        }

        if (infoWindowElement.nextElementSibling) {
          infoWindowElement.nextElementSibling!.classList.add("c-worldMap-popup-close");

          if (disableCloseButton) {
            infoWindowElement.nextElementSibling!.classList.add("c-worldMap-popup-close--hidden");
          }
        }
      }

      if (--remainingFixAttempts > 0) {
        requestAnimationFrame(() => this.fixInfoWindow());
      }
    }
  }
}
