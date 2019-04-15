import React from "react";
import "./assignFulfiller.scss";
import { Button, ButtonType, Toast, ToastType, Input, ButtonSize } from "shared/src/webKit";
import { Fulfiller } from "shared/src/model/logistics/fulfiller";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { orderDispatchService } from "./orderDispatchService";
import { Order } from "shared/src/model/logistics/order";

interface Props {
  order: Order;
}

@observer
export default class extends React.Component<Props> {
  @observable private open = false;

  @observable private errorMessage?: string;

  @observable private fulfillers?: Fulfiller[];

  @observable private filter?: string;

  @observable private assigned = false;

  public render() {
    return (
      <div className="c-dropdown">
        {this.errorMessage && (
          <Toast
            type={ToastType.Alert}
            remove={() => (this.errorMessage = undefined)}
          >
            {this.errorMessage}
          </Toast>
        )}

        <Button
          type={ButtonType.Light}
          size={ButtonSize.Medium}
          className={`c-dropdown-button ${this.open ? "expanded" : ""}`}
          onClick={() => this.toggle()}
          disabled={this.assigned || !this.props.order.allowAssignment}
        >
          Assign fulfiller
        </Button>

        {this.open && (
          <div
            className={`c-dropdown-panel ${this.assigned ? "disabled" : ""}`}
            onClick={e => e.nativeEvent.stopPropagation()}
          >
            <Input
              className="c-dropdown-filter"
              placeholder="Filter"
              onChange={text => (this.filter = (text || "").toLowerCase())}
              value={this.filter}
            />

            <div className="c-dropdown-content">
              {!this.fulfillers && <div>Loading fulfillers...</div>}

              {this.fulfillers &&
                this.fulfillers!.filter(
                  f =>
                    f.id.toLowerCase().includes(this.filter || "") ||
                    f.primaryName.toLowerCase().includes(this.filter || "") ||
                    (f.secondaryName &&
                      f.secondaryName.toLowerCase().includes(this.filter || ""))
                ).map(fulfiller => (
                  <div
                    key={fulfiller.id}
                    className="c-dropdown-item"
                    onClick={() =>
                      this.assignFulfiller(this.props.order, fulfiller)
                    }
                  >
                    <div>{fulfiller.companyName}</div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  private toggle = async () => {
    this.open = !this.open;
    if (this.open) {
      setTimeout(() =>
        window.addEventListener("click", this.toggle, { once: true })
      );
      this.fulfillers = await this.getFulfillers();
    } else {
      this.fulfillers = undefined;
      window.removeEventListener("click", this.toggle);
    }
  }

  private async getFulfillers(): Promise<Fulfiller[] | undefined> {
    try {
      return orderDispatchService.getFulfillers();
    } catch (error) {
      this.errorMessage =
        "Could not get fulfiller list. " +
        "Please try again, or contact support if the problem persists.";

      return undefined;
    }
  }

  private async assignFulfiller(
    order: Order,
    fulfiller: Fulfiller
  ): Promise<void> {
    this.assigned = true;
    try {
      await orderDispatchService.assignFulfiller(order, fulfiller);
    } catch (error) {
      this.errorMessage =
        "Could not assign the fulfiller. " +
        "Please try again, or contact support if the problem persists.";
    }
    this.toggle();
    this.assigned = false;
  }
}
