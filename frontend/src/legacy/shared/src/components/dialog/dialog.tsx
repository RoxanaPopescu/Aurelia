import React from "react";
import "./dialog.scss";

export interface DialogProps {
  className?: string;
  title: string;
  onClose: () => void;
  showCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  verifyCancel?: string;
  disabled?: boolean;
}

const defaultProps: Partial<DialogProps> = {
  showCloseButton: true,
  closeOnClickOutside: false
};

export class Dialog extends React.Component<DialogProps> {
  constructor(props: DialogProps) {
    super(props);
  }

  public render() {
    const props = { ...defaultProps, ...this.props };
    return (
      <div
        onClick={() => props.closeOnClickOutside && this.onClose()}
        className="c-dialog-container"
      >
        <div
          className={`c-dialog ${this.props.className || ""} ${props.disabled ? "c-dialog--disabled" : ""}`}
          onClick={event => event.stopPropagation()}
        >
          <div className="c-dialog-header">
            <div className="font-large">{props.title}</div>

            {props.showCloseButton && (
              <div className="c-dialog-close" onClick={() => this.onClose()}>
                <img
                  src={require("shared/src/assets/interaction/removeLight.svg")}
                />
              </div>
            )}
          </div>

          <div className="c-dialog-content">{this.props.children}</div>
        </div>
      </div>
    );
  }

  private onClose(): void {
    if (this.props.verifyCancel) {
      if (window.confirm(this.props.verifyCancel)) {
        this.props.onClose();
      }
    } else {
      this.props.onClose();
    }
  }
}
