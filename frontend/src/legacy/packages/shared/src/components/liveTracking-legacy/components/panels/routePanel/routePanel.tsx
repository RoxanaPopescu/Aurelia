import React from "react";
import ReactDOM from "react-dom";
import { reaction, IReactionDisposer } from "mobx";
import { observer } from "mobx-react";
import { SubPage } from "shared/src/utillity/page";
import { RouteStop as RouteStopModel } from "shared/src/model/logistics/routes/tracking";
import { Panel } from "../panel";
import { Actions } from "./components/actions/actions";
import { RouteInfo } from "./components/routeInfo/routeInfo";
import { RelatedRoutes } from "./components/relatedRoutes/relatedRoutes";
import { RouteStop } from "./components/routeStop/routeStop";
import "./routePanel.scss";
import { RoutesServiceLegacy } from "shared/src/components/liveTracking-legacy/services/routesService";

export interface RoutePanelProps {
  routesService: RoutesServiceLegacy;
  hidden?: boolean;
  onRouteStopSelected: (routeStop: RouteStopModel) => void;
  onSplitRouteClick: (selectedStops: RouteStopModel[]) => void;
  onDriversClick: () => void;
}

@observer
export class RoutePanel extends React.Component<RoutePanelProps> {

  public constructor(props: RoutePanelProps) {
    super(props);
  }

  private panelComponent: Panel;
  private headerElement: HTMLElement;
  private routeStopComponents: RouteStop[];
  private routeStops: RouteStopModel[];
  private reactionDisposers: IReactionDisposer[] = [];

  public componentDidMount() {
    setTimeout(() => {
      if (this.props.routesService.selectedRouteStopId != null) {
        this.scrollToRouteStop(this.props.routesService.selectedRouteStopId, "smooth");
      }
    });

    this.reactionDisposers.push(
      reaction(() => this.props.routesService.selectedRouteStopId,
        routeStopId => this.scrollToRouteStop(routeStopId, "smooth")));
  }

  public componentWillUnmount() {
    this.reactionDisposers.forEach(dispose => dispose());
    this.reactionDisposers = [];
  }

  public render() {

    const selectedRoute = this.props.routesService.selectedRoute;

    if (selectedRoute == null) {
      return <React.Fragment/>;
    }

    this.routeStops = selectedRoute.stops
      .filter(s => s instanceof RouteStopModel) as RouteStopModel[];

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
            route={selectedRoute}
            onBackClick={() => this.onBackClick()}
            onSplitRouteClick={() => this.onSplitRouteClick()}
            onDriversClick={() => this.props.onDriversClick()}
            onRouteDetailsClick={() => this.onRouteDetailsClick()}
          />

          <RouteInfo route={selectedRoute} routesService={this.props.routesService}/>

          <RelatedRoutes
            route={selectedRoute}
            onClick={routeId => this.onRelatedRouteClick(routeId)}
          />

        </div>

        <div className="c-liveTracking-panel-body">

          {this.routeStops.map(routeStop =>
          <RouteStop
            key={routeStop.id}
            ref={ref => ref && this.routeStopComponents.push(ref)}
            route={selectedRoute}
            routeStop={routeStop}
            routesService={this.props.routesService}
            onClick={() => this.props.onRouteStopSelected(routeStop)}
          />)}

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
    this.props.routesService.setSelectedRoute(undefined);

    history.back();
  }

  private onSplitRouteClick() {
    const selectedStops = this.props.routesService.selectedRoute!.stops
      .filter(s => s instanceof RouteStopModel && s.selected);

    this.props.onSplitRouteClick(selectedStops as RouteStopModel[]);
  }

  private onRouteDetailsClick(): void {
    const routeDetailsUrl = SubPage.path(SubPage.RouteDetails)
      .replace(":id", this.props.routesService.selectedRoute!.slug);

    window.open(routeDetailsUrl, "_blank");
  }

  private onRelatedRouteClick(routeId: string): void {
    const route = this.props.routesService.routes!.find(r => r.id === routeId);
    if (route != null) {
      this.props.routesService.setSelectedRoute(route);
      this.props.routesService.selectedRouteStopId = route.currentOrNextStop ?
        route.currentOrNextStop.id : undefined;
    }
    history.pushState({ ...history.state, state: { routeId: routeId }}, "", window.location.href);
  }
}
