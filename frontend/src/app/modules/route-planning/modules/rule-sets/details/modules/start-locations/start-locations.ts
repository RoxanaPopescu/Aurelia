import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { RoutePlanningSettings, DepartureTimeScenario } from "app/model/_route-planning-settings";
import { DepartureTime } from "app/model/_route-planning-settings/entities/departure-time";
import { ModalService, IValidation } from "shared/framework";
import { ScenarioPanel } from "./modals/scenario/scenario";
import { StartLocationDialog } from "./modals/start-location/start-location";
import { ConfirmDeleteScenarioDialog } from "./modals/confirm-delete-scenario/confirm-delete-scenario";
import { Log } from "shared/infrastructure";
import { ConfirmDeleteStartLocationDialog } from "./modals/confirm-delete-start-location/confirm-delete-start-location";
import { DateTime } from "luxon";
import { DayOfWeek } from "app/model/shared";

/**
 * Represents the page.
 */
@autoinject
export class StartLocations
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
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The earliest date for which gate slots should be presented.
     */
    protected dateFromFilter: DateTime | undefined;

    /**
     * The latest date for which gate slots should be presented.
     */
    protected dateToFilter: DateTime | undefined;

    /**
     * The weekdays for which gate slots should be presented.
     */
    protected weekdaysFilter: DayOfWeek[] | undefined;

    /**
     * The name of the departure time currently being presented.
     */
    protected activeDepartureTimeName: string | undefined;

    /**
     * Gets the current active departure time.
     */
    @computedFrom("settings.departureTimes.length", "activeDepartureTimeName")
    protected get activeDepartureTime(): DepartureTime | undefined
    {
        return this.settings?.departureTimes.filter(d => d.name === this.activeDepartureTimeName)[0];
    }

    /**
     * The route planning rule set.
     */
    @bindable
    public settings: RoutePlanningSettings;

    /**
     * Called by the framework when the `settings` property changes.
     * @param newValue The new value.
     */
    public settingsChanged(newValue: RoutePlanningSettings): void
    {
        this.activeDepartureTimeName = newValue.departureTimes[0]?.name;
    }

    /**
     * Gets the scenarios of the current departure time, filtered by date range and weekdays.
     */
    @computedFrom("activeDepartureTime.scenarios.length", "dateFromFilter", "dateToFilter", "weekdaysFilter")
    protected get filteredScenarios(): DepartureTimeScenario[]
    {
        let scenarios = this.activeDepartureTime?.scenarios ?? [];

        if (this.dateFromFilter != null)
        {
            scenarios = scenarios.filter(s =>
                s.criteria.datePeriod.to == null || s.criteria.datePeriod.to?.startOf("day").diff(this.dateFromFilter!).as("seconds") >= 0);
        }

        if (this.dateToFilter != null)
        {
            scenarios = scenarios.filter(s =>
                s.criteria.datePeriod.from == null || s.criteria.datePeriod.from?.startOf("day").diff(this.dateToFilter!).as("seconds") <= 0);
        }

        if (this.weekdaysFilter != null && this.weekdaysFilter.length > 0)
        {
            this.weekdaysFilter.forEach(w =>
                scenarios = scenarios.filter(s => s.criteria.weekdays.includes(w)));
        }

        return scenarios;
    }

    /**
     * Called when the "Add start location" button is clicked.
     */
    protected async onAddDepartureTimeClick(): Promise<void>
    {
        const model =
        {
            settings: this.settings,
            departureTime: new DepartureTime(),
            isNew: true
        };

        const editedDepartureTime = await this._modalService.open(StartLocationDialog, model).promise;

        if (editedDepartureTime != null)
        {
            this.settings.departureTimes.push(editedDepartureTime);
            this.activeDepartureTimeName = editedDepartureTime.name;
        }
    }

    /**
     * Called when the "Edit start location" icon is clicked.
     * Opens a modal showing the details of the departure time.
     * @param departureTime The departure time to edit.
     */
    protected async onEditDepartureTimeClick(departureTime: DepartureTime): Promise<void>
    {
        const editedDepartureTime = await this._modalService.open(StartLocationDialog, { settings: this.settings, departureTime: departureTime, isNew: false }).promise;

        if (editedDepartureTime != null)
        {
            const index = this.settings.departureTimes.indexOf(departureTime);
            this.settings.departureTimes.splice(index, 1, editedDepartureTime);
            this.activeDepartureTimeName = editedDepartureTime.name;
        }
    }

    /**
     * Called when the `Delete start location` icon is clicked on a departure time.
     * Asks the user to confirm, then deletes the departure time from the departure time.
     * @param departureTime The departure time to remove.
     */
    protected async onDeleteDepartureTimeClick(departureTime: DepartureTime): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmDeleteStartLocationDialog, departureTime).promise;

        if (!confirmed)
        {
            return;
        }

        try
        {
            this.settings.departureTimes.splice(this.settings.departureTimes.indexOf(departureTime), 1);
            this.activeDepartureTimeName = this.settings.departureTimes[0]?.name;
        }
        catch (error)
        {
            Log.error("Could not delete start location", error);
        }
    }

    /**
     * Called when the `Add reservation` button is clicked.
     */
    protected async onAddScenarioClick(): Promise<void>
    {
        const model =
        {
            vehicleGroups: this.settings.vehicleGroups,
            departureTime: this.activeDepartureTime!,
            scenario: new DepartureTimeScenario(),
            isNew: true
        };

        const editedStop = await this._modalService.open(ScenarioPanel, model).promise;

        if (editedStop != null)
        {
            this.activeDepartureTime!.scenarios.push(editedStop);
        }
    }

    /**
     * Called when a scenario is clicked.
     * Opens a modal showing the details of the scenario.
     * @param scenario The scenario being clicked.
     */
    protected async onScenarioClick(scenario: DepartureTimeScenario): Promise<void>
    {
        const model =
        {
            vehicleGroups: this.settings.vehicleGroups,
            departureTime: this.activeDepartureTime!,
            scenario,
            isNew: false
        };

        const editedScenario = await this._modalService.open(ScenarioPanel, model).promise;

        if (editedScenario != null)
        {
            const index = this.activeDepartureTime!.scenarios.indexOf(scenario);
            this.activeDepartureTime!.scenarios.splice(index, 1, editedScenario);
        }
    }

    /**
     * Called when the `Delete reservation` icon is clicked on a scenario.
     * Asks the user to confirm, then deletes the scenario.
     * @param scenario The scenario to delete.
     */
    protected async onDeleteScenarioClick(scenario: DepartureTimeScenario): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmDeleteScenarioDialog, scenario).promise;

        if (!confirmed)
        {
            return;
        }

        try
        {
            const index = this.activeDepartureTime!.scenarios.indexOf(scenario);
            this.activeDepartureTime!.scenarios.splice(index, 1);
        }
        catch (error)
        {
            Log.error("Could not delete reservation", error);
        }
    }

    /**
     * Gets the name of the vehicle group with the specified ID.
     * @param vehicleGroupId The ID of the vehicle group.
     * @returns The name of the vehicle group.
     */
    protected getVehicleGroupName(vehicleGroupId: string): string | undefined
    {
        return this.settings.vehicleGroups.find(g => g.id === vehicleGroupId)?.name;
    }
}
