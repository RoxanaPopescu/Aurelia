import { autoinject, noView, bindable, bindingMode } from "aurelia-framework";
import { Wrapper } from "../../wrappers/wrapper";
import { SpecialArea } from "app/model/_route-planning-settings";

// Import the component that should be wrapped.
import { SpecialAreasMapComponent as Component } from "./special-areas-map";
import { GeoJsonPolygon } from "shared/types";

@noView
@autoinject
export class SpecialAreasMap extends Wrapper
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor(element: Element)
    {
        super(element);
    }

    @bindable
    public areas: SpecialArea[];

    @bindable
    public redrawTrigger: number;

    @bindable({ defaultBindingMode: bindingMode.fromView })
    public hoveredArea: SpecialArea | undefined;

    @bindable
    public enableDrawing: boolean;

    @bindable
    public onAreaClick: (context: { area: SpecialArea }) => void;

    @bindable
    public onDrawingComplete: (context: { polygon: GeoJsonPolygon }) => Promise<void>;

    @bindable
    public onDrawingCancelled: () => void

    /**
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        super.attached(Component, {},
        {
            areas: this.areas,
            enableDrawing: this.enableDrawing,
            onAreaClick: area => this.onAreaClick({ area }),
            onAreaMouseEnter: area => this.hoveredArea = area,
            onAreaMouseLeave: area => this.hoveredArea === area ? this.hoveredArea = area : undefined,
            onDrawingComplete: polygon => this.onDrawingComplete({ polygon }),
            onDrawingCancelled: () => this.onDrawingCancelled()
        });
    }

    /**
     * Called by the framework when a bindable property changes.
     */
    protected propertyChanged(): void
    {
        this.attached();
    }
}
