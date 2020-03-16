import { autoinject, bindable } from "aurelia-framework";
import { RoutePlanningSettings, SpecialArea } from "app/model/_route-planning-settings";
import { ModalService } from "shared/framework";
import { GeographicAreaPanel } from "./modals/geographic-area/geographic-area";
import { GeographicAreaScenarioPanel } from "./modals/geographic-area-scenario/geographic-area-scenario";
import { GeoJsonPolygon } from "shared/types";

/**
 * Represents the page.
 */
@autoinject
export class GeographicAreas
{
    /**
     * Creates a new instance of the class.
     * @param modalService The `ModalService` instance.
     */
    public constructor(modalService: ModalService)
    {
        this._modalService = modalService;
    }

    private readonly _modalService: ModalService;

    /**
     * The area currently being hovered, if any.
     */
    protected hoveredArea: SpecialArea | undefined;

    /**
     * True if drawing is enabled, otherwise false.
     */
    protected enableDrawing = false;

    /**
     * Variable used to trigger map repaints.
     */
    protected mapRedrawTrigger = 0;

    /**
     * The id of the routeplan settings
     */
    @bindable
    public settings: RoutePlanningSettings;

    protected onAddAreaClick(): void
    {
        this.enableDrawing = true;
    }

    protected async onEditAreaClick(index: number): Promise<void>
    {
        const result = await this._modalService.open(GeographicAreaPanel, this.settings.specialAreas[index]).promise;

        if (result != null)
        {
            this.settings.specialAreas.splice(index, 1, result);
            this.mapRedrawTrigger++;
        }
    }

    protected onDeleteAreaClick(index: number): void
    {
        this.settings.specialAreas.splice(index, 1);
        this.mapRedrawTrigger++;
    }

    protected async onAddScenarioClick(area: SpecialArea): Promise<void>
    {
        const result = await this._modalService.open(GeographicAreaScenarioPanel).promise;

        if (result != null)
        {
            area.scenarios.push(result);
            this.mapRedrawTrigger++;
        }
    }

    protected async onEditScenarioClick(area: SpecialArea, index: number): Promise<void>
    {
        const result = await this._modalService.open(GeographicAreaScenarioPanel, area.scenarios[index]).promise;

        if (result != null)
        {
            area.scenarios.splice(index, 1, result);
            this.mapRedrawTrigger++;
        }
    }

    protected onDeleteScenarioClick(area: SpecialArea, index: number): void
    {
        area.scenarios.splice(index, 1);
        this.mapRedrawTrigger++;
    }

    protected onAreaClick(area: SpecialArea): void
    {
        console.log(area);
    }

    protected async onDrawingComplete(polygon: GeoJsonPolygon): Promise<void>
    {
        this.enableDrawing = false;

        const result = await this._modalService.open(GeographicAreaPanel).promise;

        if (result != null)
        {
            result.polygon = polygon;
            this.settings.specialAreas.push(result);
            this.mapRedrawTrigger++;
        }
    }

    protected onDrawingCancelled(): void
    {
        this.enableDrawing = false;
    }
}
