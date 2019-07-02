import "./styles.scss";
import React from "react";
import { Button } from "..";

export default class ButtonAdd extends Button {
  render() {
    return (
      <Button
        size={this.props.size}
        type={this.props.type}
        onClick={event => this.props.onClick && this.props.onClick(event)}
        loading={this.props.loading}
        disabled={this.props.disabled}
        id={this.props.id}
        className={this.props.className}
      >
        <div className={`plusContainer${this.props.children ? " plusContainer--margin" : ""}`}>
          <span />
          <span />
        </div>
        {this.props.children}
      </Button>
    );
  }
}
