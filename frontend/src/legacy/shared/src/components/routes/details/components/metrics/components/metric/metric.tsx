import React from "react";
import "./metric.scss";

export interface MetricProps {
  header?: string;
  body?: string;
  footer?: string;
  accent?: "neutral" | "positive" | "warning" | "negative";
}

export default function(props: MetricProps) {
  const accentClassName = props.accent ? ` c-routeDetails-metrics-metric-${props.accent}` : "";
  return (
    <div className={"c-routeDetails-metrics-metric" + accentClassName}>
      <div className="c-routeDetails-metrics-metric-header">
        {props.header}
      </div>
      <div className="c-routeDetails-metrics-metric-body">
        {props.body}
      </div>
      <div className="c-routeDetails-metrics-metric-footer">
        {props.footer}
      </div>
    </div>
  );
}
