import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { RoutePlanningSettings, DepartureTimeScenario, VehicleGroup } from "app/model/_route-planning-settings";
import { DepartureTime } from "app/model/_route-planning-settings/entities/departure-time";
import { ModalService, IValidation } from "shared/framework";
import { ScenarioPanel } from "./modals/scenario/scenario";
import { StartLocationDialog } from "./modals/start-location/start-location";
import { ConfirmDeleteScenarioDialog } from "./modals/confirm-delete-scenario/confirm-delete-scenario";
import { Log } from "shared/infrastructure";
import { ConfirmDeleteStartLocationDialog } from "./modals/confirm-delete-start-location/confirm-delete-start-location";
import { DateTime } from "luxon";
import { DayOfWeek } from "app/model/shared";
import { ISorting } from "shared/types";

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
    private _bindingUpdateTrigger = 0;

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
     * The sorting to use for the table.
     */
    protected sorting: ISorting =
    {
        property: "name",
        direction: "ascending"
    };

    /**
     * Gets the current active departure time.
     */
    @computedFrom("settings.departureTimes.length", "activeDepartureTimeName")
    protected get activeDepartureTime(): DepartureTime | undefined
    {
        return this.settings?.departureTimes.filter(d => d.name === this.activeDepartureTimeName)[0];
    }

    /**
     * Value used to trigger binding updates.
     */
    @computedFrom("_bindingUpdateTrigger", "settings.vehicleGroups.length")
    protected get bindingUpdateTrigger(): any
    {
        return `${this._bindingUpdateTrigger}|${this.settings.vehicleGroups.length}`;
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
    @computedFrom("activeDepartureTime.scenarios.length", "dateFromFilter", "dateToFilter", "weekdaysFilter", "sorting")
    protected get orderedAndFilteredScenarios(): DepartureTimeScenario[]
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

        const offset = this.sorting.direction === "ascending" ? 1 : -1;
        const getPropertyValue = (scenario: DepartureTimeScenario, property: string) =>
        {
            switch (property)
            {
                case "name": return scenario.name;
                case "gate": return scenario.gates[0].name;
                case "weekdays": return scenario.criteria.weekdays.join(",");
                case "from-date": return scenario.criteria.datePeriod.from?.valueOf() ?? "";
                case "to-date": return scenario.criteria.datePeriod.to?.valueOf() ?? "";
                case "vehicle-group": return this.getVehicleGroup(scenario.gates[0].slots[0].vehicleGroup)?.name ?? "";
                default: return "";
            }
        };

        return scenarios
            .slice()
            .sort((a, b) =>
            {
                const aPropertyValue = getPropertyValue(a, this.sorting.property);
                const bPropertyValue = getPropertyValue(b, this.sorting.property);

                // Sort by selected column and direction.
                if (aPropertyValue < bPropertyValue) { return -offset; }
                if (aPropertyValue > bPropertyValue) { return offset; }

                return 0;
            });
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

            this._bindingUpdateTrigger++;
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

            this._bindingUpdateTrigger++;
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

            this._bindingUpdateTrigger++;
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

            this._bindingUpdateTrigger++;
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

            this._bindingUpdateTrigger++;
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

            this._bindingUpdateTrigger++;
        }
        catch (error)
        {
            Log.error("Could not delete reservation", error);
        }
    }

    /**
     * Gets the vehicle group with the specified ID.
     * @param vehicleGroupId The ID of the vehicle group.
     * @param bindingUpdateTrigger Hack used to ensure bindings update as expected.
     * @returns The the vehicle group.
     */
    protected getVehicleGroup(vehicleGroupId: string, bindingUpdateTrigger?: any): VehicleGroup | undefined
    {
        return this.settings.vehicleGroups.find(g => g.id === vehicleGroupId);
    }

    /**
     * Determines whether any references to deleted vehicle groups exists.
     * @param departureTime The departure time to check, or undefined to check all.
     * @param bindingUpdateTrigger Hack used to ensure bindings update as expected.
     * @returns True if any references to deleted vehicle groups exists, otherwise false.
     */
    protected hasDeletedVehicleGroups(departureTime?: DepartureTime, bindingUpdateTrigger?: any): boolean
    {
        if (this.settings != null)
        {
            if (departureTime != null)
            {
                for (const scenario of departureTime.scenarios)
                {
                    if (!this.settings.vehicleGroups.some(g => g.id === scenario.gates[0].slots[0].vehicleGroup))
                    {
                        return true;
                    }
                }
            }
            else
            {
                for (const departureTime of this.settings.departureTimes)
                {
                    for (const scenario of departureTime.scenarios)
                    {
                        if (!this.settings.vehicleGroups.some(g => g.id === scenario.gates[0].slots[0].vehicleGroup))
                        {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }
}
