import { autoinject, bindable } from "aurelia-framework";
import { AutoContractorAssignmentRule, AutoContractorAssignmentSettings } from "app/model/auto-contractor-assignment";
import { ModalService } from "shared/framework";
import { GeoJsonPolygon } from "shared/types";
import { groupItems } from "shared/utilities";
import { DataColorIndex } from "resources/styles";
import { GeographicAreaPanel } from "./modals/geographic-area/geographic-area";
import { ConfirmDeleteAreaDialog } from "./modals/confirm-delete-area/confirm-delete-area";

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
    private _currentAreaModel: { area: AutoContractorAssignmentRule; index?: number } | undefined;

    /**
     * True if drawing is enabled, otherwise false.
     */
    protected enableDrawing = false;

    /**
     * True if all areas are selected, false if no areas are selected, or null if some areas are selected.
     */
    protected allAreasSelected: boolean | null = true;

    /**
     * The auto contractor assignment settings.
     */
    @bindable
    public settings: AutoContractorAssignmentSettings;

    /**
     * True if the componentis visible to the user, otherwise false.
     */
    @bindable
    public visible = false;

    /**
     * Called when the selection of an area is toggled.
     * Updates the select all state.
     * @param area The area to toggle, or undefined to only update the select all state.
     */
    protected onToggleArea(area?: AutoContractorAssignmentRule): void
    {
        if (area != null)
        {
            area.selected = !area.selected;
        }

        this.allAreasSelected =
            this.settings.rules.every(a => a.selected) ||
            (this.settings.rules.some(a => a.selected) ? null : false);
    }

    /**
     * Called when the `Select all` checkbox is toggled.
     * Selects or deselects all areas.
     */
    protected onToggleAllAreas(): void
    {
        const allAreasSelected = this.allAreasSelected;

        for (const area of this.settings.rules)
        {
            area.selected = !allAreasSelected;
        }

        this.onToggleArea();
    }

    /**
     * Called when the "Add area" button is clicked.
     * Begins the process of adding an area, by enabling drawing on the map.
     */
    protected onAddAreaClick(): void
    {
        this._currentAreaModel = { area: new AutoContractorAssignmentRule() };
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
        const area = this.settings.rules[index].clone();

        this.enableDrawing = false;
        this._currentAreaModel = { area, index };

        const result = await this._modalService.open(GeographicAreaPanel, { ...this._currentAreaModel, allAreas: this.settings.rules }).promise;

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
            this.settings.rules.splice(index, 1, this._currentAreaModel.area);
            this._currentAreaModel = undefined;
        }
    }

    /**
     * Called when the "Delete area" icon is clicked on an area.
     * Asks for confirmation, then deletes the area.
     * @param area The area.
     */
    protected async onDeleteAreaClick(index: number): Promise<void>
    {
        const area = this.settings.rules[index];

        if (!await this._modalService.open(ConfirmDeleteAreaDialog, area).promise)
        {
            return;
        }

        this.settings.rules.splice(index, 1);

        if (area.id != null)
        {
            this.settings.deletedRules.push(area);
        }
    }

    /**
     * Called when the user completes a drawing on the map.
     * Opens the modal for creating an area.
     */
    protected async onDrawingCompleted(polygon: GeoJsonPolygon): Promise<void>
    {
        const result = await this._modalService.open(GeographicAreaPanel, { ...this._currentAreaModel!, allAreas: this.settings.rules }).promise;

        if (result == null)
        {
            this.enableDrawing = false;

            this._currentAreaModel = undefined;
        }
        else if (result === "done")
        {
            this.enableDrawing = false;

            this._currentAreaModel!.area.conditions.polygons = [polygon];

            if (this._currentAreaModel!.index != null)
            {
                this.settings.rules.splice(this._currentAreaModel!.index, 1, this._currentAreaModel!.area);
            }
            else
            {
                this.settings.rules.unshift(this._currentAreaModel!.area);
            }

            this._currentAreaModel = undefined;
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
            const result = await this._modalService.open(GeographicAreaPanel, { ...this._currentAreaModel!, allAreas: this.settings.rules }).promise;

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
                this.settings.rules.splice(this._currentAreaModel!.index, 1, this._currentAreaModel!.area);

                this._currentAreaModel = undefined;
            }
        }
    }

    /**
     * Gets the suggested color for a new area, based on the colors already used.
     * @returns The index of the suggested color.
     */
    private getSuggestedColor(): DataColorIndex
    {
        const colorsInUse = groupItems(this.settings.rules.map(a => a.color));

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
