import React from "react";
import ReactDOM from "react-dom";
import { reaction, IReactionDisposer } from "mobx";
import { observer } from "mobx-react";
import { SubPage } from "shared/src/utillity/page";
import { LiveTrackingService } from "../../../services/liveTrackingService";
import { Panel } from "../panel";
import { Actions } from "./components/actions/actions";
import { RouteInfo } from "./components/routeInfo/routeInfo";
import { RouteStopComponent } from "./components/routeStop/routeStop";
import "./routePanel.scss";
import { RouteStop } from "app/model/route";
import { ThreeDotsAnimated } from "shared/src/webKit";

export interface RoutePanelProps {
  service: LiveTrackingService;
  hidden?: boolean;
  onRouteStopSelected: (routeStop: RouteStop) => void;
  onSplitRouteClick: (selectedStops: RouteStop[]) => void;
  onDriversClick: () => void;
}

@observer
export class RoutePanel extends React.Component<RoutePanelProps> {

  public constructor(props: RoutePanelProps) {
    super(props);
  }

  private panelComponent: Panel;
  private headerElement: HTMLElement;
  private routeStopComponents: RouteStopComponent[];
  private routeStops: RouteStop[];
  private reactionDisposers: IReactionDisposer[] = [];

  public componentDidMount() {
    setTimeout(() => {
      if (this.props.service.selectedRouteStopId != null) {
        this.scrollToRouteStop(this.props.service.selectedRouteStopId, "smooth");
      }
    });

    this.reactionDisposers.push(
      reaction(() => this.props.service.selectedRouteStopId,
        routeStopId => this.scrollToRouteStop(routeStopId, "smooth")));
  }

  public componentWillUnmount() {
    this.reactionDisposers.forEach(dispose => dispose());
    this.reactionDisposers = [];
  }

  public renderStops(): JSX.Element[] | JSX.Element | undefined {
    const selectedRoute = this.props.service.selectedRoute;

    if (!selectedRoute) {
      return (
        <div className="c-liveTracking-stops-loading">
          <ThreeDotsAnimated small={false} light={false} />
        </div>
      );
    }

    this.routeStops = selectedRoute.stops
    .filter(s => s instanceof RouteStop) as RouteStop[];

    return this.routeStops.map(routeStop =>
      <RouteStopComponent
        key={routeStop.id}
        ref={ref => ref && this.routeStopComponents.push(ref)}
        route={selectedRoute}
        routeStop={routeStop}
        service={this.props.service}
        onClick={() => this.props.onRouteStopSelected(routeStop)}
      />);
  }

  public render() {
    let route = this.props.service.selectedListRoute;

    if (!route) {
      return null;
    }

    this.routeStopComponents = [];

    return (
      <Panel
        ref={ref => ref && (this.panelComponent = ref)}
        className="c-liveTracking-routePanel"
        hidden={this.props.hidden}
      >

        <div
          ref={ref => ref && (this.headerElement = ref)}
          className="c-liveTracking-panel-header"
        >
          <Actions
            route={this.props.service.selectedRoute}
            onBackClick={() => this.onBackClick()}
            onSplitRouteClick={() => this.onSplitRouteClick()}
            onDriversClick={() => this.props.onDriversClick()}
            onRouteDetailsClick={() => this.onRouteDetailsClick()}
          />

          <RouteInfo service={this.props.service}/>

        </div>

        <div className="c-liveTracking-panel-body">
          {this.renderStops()}
        </div>

      </Panel>
    );
  }

  private scrollToRouteStop(routeStopId: string | undefined, behavior: ScrollBehavior) {
    if (routeStopId == null || this.panelComponent == null || this.headerElement == null) {
      return;
    }

    const panelElement = (ReactDOM.findDOMNode(this.panelComponent) as HTMLElement);

    const routeStopIndex = this.routeStops.findIndex(x => x.id === routeStopId)!;
    let routeStopComponent = this.routeStopComponents[routeStopIndex];
    let routeStopElement = (ReactDOM.findDOMNode(routeStopComponent) as HTMLElement);

    // In case the route stop is no longer in the DOM.
    if (routeStopElement == null) {
      return;
    }

    const headerHeight = this.headerElement.offsetHeight;

    // Note that the header is sticky and therefore does not contribute to the offset.
    // Also note that we have to subtract the top margin of the element, as that does
    // not contribute to the offset either.
    const elementMargin = 4;
    const elementOffset = routeStopElement.offsetTop - elementMargin;
    const elementHeight = routeStopElement.offsetHeight + elementMargin;

    const minVisibleOffset = panelElement.scrollTop;
    const maxVisibleOffset = minVisibleOffset + panelElement.clientHeight - headerHeight;
    const scroll = elementOffset < minVisibleOffset || elementOffset + elementHeight + elementMargin > maxVisibleOffset;

    if (scroll) {
      panelElement.scrollTo({ top: elementOffset, behavior });
    }
  }

  private onBackClick() {
    this.props.service.setSelectedRouteSlug(undefined);
    history.back();
  }

  private onSplitRouteClick() {
    const selectedStops = this.props.service.selectedRoute!.stops
      .filter(s => s instanceof RouteStop && s.selected);

    this.props.onSplitRouteClick(selectedStops as RouteStop[]);
  }

  private onRouteDetailsClick(): void {
    const routeDetailsUrl = SubPage.path(SubPage.RouteDetails)
      .replace(":id", this.props.service.selectedListRoute!.slug);

    window.open(routeDetailsUrl, "_blank");
  }
}
