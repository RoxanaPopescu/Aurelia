import { autoinject, bindable } from "aurelia-framework";
import { RoutePlanningSettings, SpecialArea } from "app/model/_route-planning-settings";
import { ModalService } from "shared/framework";
import { GeographicAreaPanel } from "./modals/geographic-area/geographic-area";
import { GeographicAreaScenarioPanel } from "./modals/geographic-area-scenario/geographic-area-scenario";
import { GeoJsonPolygon } from "shared/types";
import { groupItems } from "shared/utilities";
import { DataColorIndex } from "resources/styles";

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
    private _currentAreaModel: { area: SpecialArea; index?: number } | undefined;

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
        this._currentAreaModel = { area: new SpecialArea() };
        this._currentAreaModel.area.color = this.getSuggestedColor();
        this.enableDrawing = true;
    }

    protected async onEditAreaClick(index: number): Promise<void>
    {
        this.enableDrawing = false;
        this._currentAreaModel = { area: this.settings.specialAreas[index].clone(), index };

        const result = await this._modalService.open(GeographicAreaPanel, this._currentAreaModel).promise;

        if (result == null)
        {
            this._currentAreaModel = undefined;
        }
        else if (result === "draw-new-area")
        {
            this.enableDrawing = true;
        }
        else if (result === "done")
        {
            this.settings.specialAreas.splice(index, 1, this._currentAreaModel.area);
            this._currentAreaModel = undefined;
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
        const result = await this._modalService.open(GeographicAreaPanel, this._currentAreaModel).promise;

        if (result == null)
        {
            this.enableDrawing = false;

            this._currentAreaModel = undefined;
        }
        else if (result === "done")
        {
            this.enableDrawing = false;

            this._currentAreaModel!.area.polygon = polygon;

            if (this._currentAreaModel!.index != null)
            {
                this.settings.specialAreas.splice(this._currentAreaModel!.index, 1, this._currentAreaModel!.area);
            }
            else
            {
                this.settings.specialAreas.push(this._currentAreaModel!.area);
            }

            this._currentAreaModel = undefined;
            this.mapRedrawTrigger++;
        }
    }

    protected async onDrawingCancelled(): Promise<void>
    {
        this.enableDrawing = false;

        if (this._currentAreaModel!.index == null)
        {
            this._currentAreaModel = undefined;
        }
        else
        {
            const result = await this._modalService.open(GeographicAreaPanel, this._currentAreaModel).promise;

            if (result == null)
            {
                this._currentAreaModel = undefined;
            }
            else if (result === "draw-new-area")
            {
                this.enableDrawing = true;
            }
            else if (result === "done")
            {
                this.settings.specialAreas.splice(this._currentAreaModel!.index, 1, this._currentAreaModel!.area);

                this._currentAreaModel = undefined;
                this.mapRedrawTrigger++;
            }
        }
    }

    private getSuggestedColor(): DataColorIndex
    {
        const colorsInUse = groupItems(this.settings.specialAreas.map(a => a.color));

        for (let color = 1; color <= 8; color++)
        {
            if (!colorsInUse.has(color as DataColorIndex))
            {
                return color as DataColorIndex;
            }
        }

        return Array.from(colorsInUse).sort((a, b) => a[0] - b[0]).sort((a, b) => a[1].length - b[1].length)[0][0];
    }
}
