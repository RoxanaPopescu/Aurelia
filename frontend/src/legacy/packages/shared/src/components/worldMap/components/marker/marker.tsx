import React from "react";
import { ReactNode } from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import "./marker.scss";

const popupOwners = new Map<string, Marker<object>>();

/**
 * Represents a marker on a map, which may have an associated popup.
 */
@observer
export class Marker<T> extends React.Component<T> {

  /**
   * True if the popup is visible, otherwise false.
   */
  @observable
  protected popupState: "show" | "hide" = "hide";

  /**
   * The group to which the popup belongs, or undefined
   * to allow multiple popups to be open at the same time.
   */
  protected popupGroup: string | undefined;

  /**
   * The time in milliseconds before the popup dissapears,
   * after the mouse leaves the marker or popup.
   */
  protected popupShowDelay = 200;

  /**
   * The time in milliseconds before the popup appears,
   * after the mouse enters the marker.
   */
  protected popupHideDelay = 50;

  // tslint:disable-next-line:no-any
  private timeoutHandle: any;

  /**
   * Show the popup associated with the marker.
   */
  protected showPopup = (delay = this.popupShowDelay) => {

    if (this.popupGroup != null) {
      const popupOwner = popupOwners.get(this.popupGroup);
      if (popupOwner != null && popupOwner !== this) {
        popupOwner.hidePopup();
      }
      popupOwners.set(this.popupGroup, this);
    }

    clearTimeout(this.timeoutHandle);
    this.timeoutHandle = setTimeout(() => this.popupState = "show", delay);
  }

  /**
   * Hide the popup associated with the marker.
   */
  protected hidePopup = (delay = this.popupHideDelay) => {

    if (this.popupGroup != null) {
      popupOwners.delete(this.popupGroup);
    }

    if (delay === 0) {
      this.popupState = "hide";
    } else {

      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = setTimeout(() => this.popupState = "hide", delay);
    }
  }

  /**
   * Toggle the popup associated with the marker.
   */
  protected togglePopup = () => {
    if (!this.popupState) {
      this.showPopup();
    } else {
      this.hidePopup(0);
    }
  }

  /**
   * When overridden in a derived class,
   * renders the marker.
   */
  protected renderMarker(): ReactNode {
    return undefined;
  }

  /**
   * When overridden in a derived class,
   * renders the popup.
   */
  protected renderPopup(): ReactNode {
    return undefined;
  }

  /**
   * Renders the component.
   */
  public render(): ReactNode {
    return (
      <React.Fragment>

        {this.renderMarker()}

        {this.popupState === "show" &&
        this.renderPopup()}

      </React.Fragment>);
  }

  /**
   * Called when the component is about to unmount.
   * Note that when extending this class, this must be called,
   * as the instance will otherwise not be garbage collected.
   */
  public componentWillUnmount() {
    if (this.popupGroup != null && popupOwners.get(this.popupGroup) === this) {
      popupOwners.delete(this.popupGroup);
    }
  }
}
