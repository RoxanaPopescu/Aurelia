import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { RoutePlanningSettings, Gate, DepartureTimeScenario } from "app/model/_route-planning-settings";
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
     * Current tab page name the user has active.
     */
    @bindable
    public activeDepartureTimeName: string | undefined;

    /**
     * The date used to filter scenarios.
     */
    @bindable
    public dateFromFilter: DateTime | undefined;

    /**
     * The date used to filter scenarios.
     */
    @bindable
    public dateToFilter: DateTime | undefined;

    /**
     * The weekdays used to filter scenarios.
     */
    @bindable
    public weekdaysFilter: DayOfWeek[] = [];

    /**
     * The id of the routeplan settings
     */
    @bindable
    public settings: RoutePlanningSettings;

    /**
     * Called by the framework when the module is activated.
     */
    public settingsChanged(newValue: RoutePlanningSettings): void
    {
        this.activeDepartureTimeName = newValue.departureTimes[0]?.name;
    }

    /**
     * Extract unique gates.
     */
    @computedFrom("activeDepartureTime")
    protected get gates(): Gate[]
    {
        const gates: Gate[] = [];

        if (this.activeDepartureTime != null)
        {
            this.activeDepartureTime.scenarios
                .forEach(s => {
                    s.gates.forEach(g => {
                        if (gates.filter(gate => gate.name === g.name).length === 0)
                        {
                            gates.push(g);
                        }
                    });
                });
        }

        return gates;
    }

    /**
     * Returns an array of scenarios filtered by date and tag filters.
     */
    @computedFrom("activeDepartureTime.scenarios", "dateFromFilter", "dateToFilter", "weekdaysFilter")
    protected get filteredScenarios(): DepartureTimeScenario[]
    {
        let scenarios = this.activeDepartureTime?.scenarios ?? [];

        if (this.dateFromFilter != null)
        {
            scenarios = scenarios.filter(s =>
                s.criteria.datePeriod.from == null || s.criteria.datePeriod.from?.diff(this.dateFromFilter!).as("seconds") >= 0);
        }

        if (this.dateToFilter != null)
        {
            scenarios = scenarios.filter(s =>
                s.criteria.datePeriod.to == null || s.criteria.datePeriod.to?.diff(this.dateToFilter!).as("seconds") <= 0);
        }

        if (this.weekdaysFilter.length > 0)
        {
            this.weekdaysFilter.forEach(w => {
                scenarios = scenarios.filter(s => s.criteria.weekdays.indexOf(w) > -1);
            });
        }

        return scenarios;
    }

    /**
     * Called when a scenario is clicked.
     * Opens a modal showing the details of the scenario.
     * @param scenario The stop to edit.
     */
    protected async onScenarioClick(scenario: DepartureTimeScenario): Promise<void>
    {
        const savedScenario = await this._modalService.open(
            ScenarioPanel,
            {
                vehicleGroups: this.settings.vehicleGroups,
                departureTime: this.activeDepartureTime!,
                scenario: scenario,
                isNew: false
            }).promise;

        if (savedScenario != null)
        {
            const index = this.activeDepartureTime!.scenarios.indexOf(scenario);
            this.activeDepartureTime!.scenarios.splice(index, 1, savedScenario);
        }
    }

    /**
     * Called when the `Add new scenario` button is clicked.
     */
    protected async onAddScenarioClick(): Promise<void>
    {
        const scenario = new DepartureTimeScenario(undefined);
        const savedStop = await this._modalService.open(
            ScenarioPanel,
            {
                vehicleGroups: this.settings.vehicleGroups,
                departureTime: this.activeDepartureTime!,
                scenario: scenario,
                isNew: true
            }).promise;

        if (savedStop != null)
        {
            // Do something
        }
    }

    /**
     * Called when the `Remove scenario` icon is clicked on a scenario.
     * Asks the user to confirm, then deletes the scenario from the departure time.
     * @param scenario The scenario to remove.
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
            this.activeDepartureTime!.scenarios.splice(this.activeDepartureTime!.scenarios.indexOf(scenario), 1);
        }
        catch (error)
        {
            Log.error("Could not remove scenario", error);
        }
    }

    /**
     * Called when the `Remove departure time` icon is clicked on a departure time.
     * Asks the user to confirm, then deletes the departure time from the departure time.
     * @param departureTime The departure time to remove.
     */
    protected async onDeleteStartLocationClick(departureTime: DepartureTime): Promise<void>
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
            Log.error("Could not remove start location", error);
        }
    }

    /**
     * Called when the "Edit start location" icon is clicked.
     * Opens a modal showing the details of the departure time.
     * @param departureTime The start location to edit.
     */
    protected async onEditStartLocationClick(departureTime: DepartureTime): Promise<void>
    {
        const savedDepartureTime = await this._modalService.open(StartLocationDialog, { settings: this.settings, departureTime: departureTime, isNew: false }).promise;

        if (savedDepartureTime != null)
        {
            const index = this.settings.departureTimes.indexOf(departureTime);
            this.settings.departureTimes.splice(index, 1, savedDepartureTime);
            this.activeDepartureTimeName = savedDepartureTime.name;
        }
    }

    /**
     * Called when the "Add start location" button is clicked.
     */
    protected async onAddStartLocationClick(): Promise<void>
    {
        let departureTime: DepartureTime | undefined = new DepartureTime();
        departureTime = await this._modalService.open(StartLocationDialog, { settings: this.settings, departureTime: departureTime, isNew: true }).promise;

        if (departureTime != null)
        {
            this.settings.departureTimes.push(departureTime);
            this.activeDepartureTimeName = departureTime.name;
        }
    }

    /**
     * Gets the current active departure time.
     */
    protected get activeDepartureTime(): DepartureTime | undefined
    {
        return this.settings?.departureTimes.filter(d => d.name === this.activeDepartureTimeName)[0];
    }
}
