import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import { Route as RouteModel } from "shared/src/model/logistics/routes/tracking";
import "./relatedRoutes.scss";

export interface RelatedRoutesProps {
  route: RouteModel;
  onClick: (routeId: string) => void;
}

@observer
export class RelatedRoutes extends React.Component<RelatedRoutesProps> {

  public render() {
    if (this.props.route.relatedRoutes.length === 0) {
      return <></>;
    }
    
    return (
      <div className="c-liveTracking-routePanel-relatedRoutes">
      
        <div className="c-liveTracking-routePanel-relatedToutes-title">
        {Localization.sharedValue("LiveTracking_Route_RelatedRoutes")}
        </div>

        {this.props.route.relatedRoutes.map(routeReference =>
        <div
          key={routeReference.id}
          className="c-liveTracking-panel-message c-liveTracking-box-neutral c-liveTracking-box-clickable"
          onClick={() => this.props.onClick(routeReference.id)}
        >
          {Localization.sharedValue("LiveTracking_Route_Title", {
            slug: routeReference.slug
          })}
        </div>)}

      </div>
    );
  }
}
