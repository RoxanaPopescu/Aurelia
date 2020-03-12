import { autoinject, bindable } from "aurelia-framework";
import { RoutePlanningSettings, SpecialArea } from "app/model/_route-planning-settings";
import { ModalService } from "shared/framework";
import { GeographicAreaPanel } from "./modals/geographic-area/geographic-area";
import { GeographicAreaScenarioPanel } from "./modals/geographic-area-scenario/geographic-area-scenario";

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
     * The id of the routeplan settings
     */
    @bindable
    protected settings: RoutePlanningSettings;

    protected async onAddAreaClick(): Promise<void>
    {
        const result = await this._modalService.open(GeographicAreaPanel).promise;

        if (result != null)
        {
            this.settings.specialAreas.push(result);
        }
    }

    protected async onEditAreaClick(index: number): Promise<void>
    {
        const result = await this._modalService.open(GeographicAreaPanel, this.settings.specialAreas[index]).promise;

        if (result != null)
        {
            this.settings.specialAreas.splice(index, 1, result);
        }
    }

    protected onDeleteAreaClick(index: number): void
    {
        this.settings.specialAreas.splice(index, 1);
    }

    protected async onAddScenarioClick(area: SpecialArea): Promise<void>
    {
        const result = await this._modalService.open(GeographicAreaScenarioPanel).promise;

        if (result != null)
        {
            area.scenarios.push(result);
        }
    }

    protected async onEditScenarioClick(area: SpecialArea, index: number): Promise<void>
    {
        const result = await this._modalService.open(GeographicAreaScenarioPanel, area.scenarios[index]).promise;

        if (result != null)
        {
            area.scenarios.splice(index, 1, result);
        }
    }

    protected onDeleteScenarioClick(area: SpecialArea, index: number): void
    {
        area.scenarios.splice(index, 1);
    }
}
