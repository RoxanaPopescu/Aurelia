import { autoinject } from "aurelia-framework";
import { IValidation, Modal } from "shared/framework";
import { DepartureTimeScenario, DepartureTime, VehicleGroup, Gate, GateSlot } from "app/model/_route-planning-settings";
import { Duration } from "luxon";
import { Log } from "shared/infrastructure";

@autoinject
export class ScenarioPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(modal: Modal)
    {
        this._modal = modal;
    }

    private readonly _modal: Modal;
    private _result: DepartureTimeScenario | undefined;

    /**
     * The vehicle group the scenario is linked to.
     */
    protected selectedVehicleGroup: VehicleGroup | undefined;

    /**
     * The selected duration for earliest arrival.
     */
    protected selectedEarliestArrival: Duration | undefined;

    /**
     * The selected duration for latest departure.
     */
    protected selectedLatestDeparture: Duration | undefined;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The model for the modal.
     */
    protected model: { vehicleGroups: VehicleGroup[]; departureTime: DepartureTime; scenario: DepartureTimeScenario; isNew: boolean };

    /**
     * Called by the framework when the modal is activated.
     * @param model The vehicle groups of the setting, departure time for which the scenario belongs and the scenario itself.
     */
    public activate(model: { vehicleGroups: VehicleGroup[]; departureTime: DepartureTime; scenario: DepartureTimeScenario; isNew: boolean }): void
    {
        this.model =
        {
            vehicleGroups: model.vehicleGroups,
            departureTime: model.departureTime,
            scenario: model.scenario.clone(),
            isNew: model.isNew
        };

        if (this.model.scenario.gates.length === 0)
        {
            this.model.scenario.gates.push(new Gate());
        }

        if (this.model.scenario.gates[0].slots.length === 0)
        {
            this.model.scenario.gates[0].slots.push(new GateSlot());
        }

        if (!this.model.isNew)
        {
            this.selectedVehicleGroup = this.model.vehicleGroups.filter(v => v.id === this.model.scenario.gates[0].slots[0].vehicleGroup)[0];
            this.selectedEarliestArrival = Duration.fromObject({ seconds: this.model.scenario.gates[0].slots[0].earliestArrivalTime });
            this.selectedLatestDeparture = Duration.fromObject({ seconds: this.model.scenario.gates[0].slots[0].latestDepartureTime });
        }
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The scenario to save, or undefined if cancelled.
     */
    public deactivate(): DepartureTimeScenario | undefined
    {
        return this._result;
    }

    /**
     * Called when the "Save" icon is clicked.
     * Saves changes and closes the modal.
     */
    protected async onSaveClick(): Promise<void>
    {
        try
        {
            // Activate validation so any further changes will be validated immediately.
            this.validation.active = true;

            // Validate the form.
            if (!await this.validation.validate())
            {
                return;
            }

            // Mark the modal as busy.
            this._modal.busy = true;

            this.model.scenario.gates[0].slots[0].earliestArrivalTime = this.selectedEarliestArrival!.as("seconds");
            this.model.scenario.gates[0].slots[0].latestDepartureTime = this.selectedLatestDeparture!.as("seconds");
            this.model.scenario.gates[0].slots[0].vehicleGroup = this.selectedVehicleGroup!.id;

            // Set the result of the modal.
            this._result = this.model.scenario;

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not save the reservation", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
