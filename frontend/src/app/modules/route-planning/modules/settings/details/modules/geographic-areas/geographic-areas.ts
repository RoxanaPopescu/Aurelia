import { autoinject, bindable } from "aurelia-framework";
import { RoutePlanningSettings, SpecialArea } from "app/model/_route-planning-settings";
import { ModalService } from "shared/framework";
import { GeoJsonPolygon } from "shared/types";
import { groupItems } from "shared/utilities";
import { DataColorIndex } from "resources/styles";
import { GeographicAreaPanel } from "./modals/geographic-area/geographic-area";
import { GeographicAreaScenarioPanel } from "./modals/geographic-area-scenario/geographic-area-scenario";
import { ConfirmDeleteAreaDialog } from "./modals/confirm-delete-area/confirm-delete-area";
import { ConfirmDeleteAreaScenarioDialog } from "./modals/confirm-delete-area-scenario/confirm-delete-area-scenario";

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

    /**
     * Called when the "Add area" button is clicked.
     * Begins the process of adding an area, by enabling drawing on the map.
     */
    protected onAddAreaClick(): void
    {
        this._currentAreaModel = { area: new SpecialArea() };
        this._currentAreaModel.area.color = this.getSuggestedColor();
        this.enableDrawing = true;
    }

    /**
     * Called when the "Edit area" icon is clicked on an area.
     * Opens the modal for editing the area.
     * @param area The area.
     */
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

    /**
     * Called when the "Delete area" icon is clicked on an area.
     * Asks for confirmation, then deletes the area.
     * @param area The area.
     */
    protected async onDeleteAreaClick(index: number): Promise<void>
    {
        if (!await this._modalService.open(ConfirmDeleteAreaDialog, this.settings.specialAreas[index]).promise)
        {
            return;
        }

        this.settings.specialAreas.splice(index, 1);
        this.mapRedrawTrigger++;
    }

    /**
     * Called when the "Add area rule" icon is clicked on an area rule.
     * Opens the modal for creating an area rule.
     * @param area The area owning the rule.
     */
    protected async onAddScenarioClick(area: SpecialArea): Promise<void>
    {
        const result = await this._modalService.open(GeographicAreaScenarioPanel).promise;

        if (result != null)
        {
            area.scenarios.push(result);
            this.mapRedrawTrigger++;
        }
    }

    /**
     * Called when the "Edit area rule" icon is clicked on an area rule.
     * Opens the modal for editing the area rule.
     * @param event The mouse event.
     * @param area The area owning the rule.
     * @param index The index of the rule.
     */
    protected async onEditScenarioClick(event: MouseEvent, area: SpecialArea, index: number): Promise<void>
    {
        if (event.defaultPrevented)
        {
            return;
        }

        const result = await this._modalService.open(GeographicAreaScenarioPanel, area.scenarios[index]).promise;

        if (result != null)
        {
            area.scenarios.splice(index, 1, result);
            this.mapRedrawTrigger++;
        }
    }

    /**
     * Called when the "Delete area rule" icon is clicked on an area rule.
     * Asks for confirmation, then deletes the area rule.
     * @param area The area owning the rule.
     * @param index The index of the rule.
     */
    protected async onDeleteScenarioClick(area: SpecialArea, index: number): Promise<void>
    {
        if (!await this._modalService.open(ConfirmDeleteAreaScenarioDialog, index + 1).promise)
        {
            return;
        }

        area.scenarios.splice(index, 1);
        this.mapRedrawTrigger++;
    }

    /**
     * Called when an area is clicked on the map.
     * @param area The area that was clicked.
     */
    protected onAreaClick(area: SpecialArea): void
    {
        console.log(area);
    }

    /**
     * Called when the user completes a drawing on the map.
     * Opens the modal for creating an area.
     */
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

    /**
     * Called when the user cancels a drawing on the map.
     * Reverts state, and if the modal for editing the area was open, reopens the modal.
     */
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

    /**
     * Gets the suggested color for a new area, based on the colors already used.
     * @returns The index of the suggested color.
     */
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
