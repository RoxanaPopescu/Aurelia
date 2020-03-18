import React from "react";
import { observer } from "mobx-react";
import { Polygon } from "react-google-maps";
import { Container, BindingEngine, Disposable } from "aurelia-framework";
import { SpecialArea } from "app/model/_route-planning-settings";
import { getCssVariable } from "legacy/helpers/css-helper";

export interface AreaLayerProps
{
    index: number;
    area: SpecialArea
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

@observer
export class AreaLayer extends React.Component<AreaLayerProps>
{
    private selectedSubscription: Disposable;

    componentDidMount()
    {
        this.selectedSubscription = Container.instance.get(BindingEngine)
            .expressionObserver(this, "props.area.selected")
            .subscribe(() => this.forceUpdate());
    }

    componentWillUnmount()
    {
        this.selectedSubscription.dispose();
    }

    public render = () =>
    {

        return (
            <React.Fragment>

                <Polygon
                    onClick={() => this.props.onClick?.()}
                    onMouseOver={() => this.props.onMouseEnter?.()}
                    onMouseOut={() => this.props.onMouseLeave?.()}
                    key={`polygon-${this.props.index}`}
                    path={this.props.area.polygon.coordinates[0].map(pos => ({ lng: pos[0], lat: pos[1] }))}
                    options={{
                        geodesic: false,
                        strokeColor: getCssVariable(`--palette-color-data-${this.props.area.color}`),
                        strokeOpacity: this.props.area.selected ? 0.9 : 0.2,
                        fillColor: getCssVariable(`--palette-color-data-${this.props.area.color}`),
                        fillOpacity: this.props.area.selected ? 0.4 : 0.05,
                        strokeWeight: 2,
                        zIndex: this.props.index
                    }}
                />);

            </React.Fragment>
        );
    }
}
