import { autoinject, bindable, computedFrom } from 'aurelia-framework';
import { IValidation, Modal } from "shared/framework";
import { DepartureTimeScenario, DepartureTime, Gate, VehicleGroup, GateSlot } from "app/model/_route-planning-settings";
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
     * Current tab page the user is routed to.
     */
    protected selectedVehicleGroup: VehicleGroup | undefined;

    /**
     * Current tab page the user is routed to.
     */
    protected reservationInterval: number | undefined;

    /**
     * Current tab page the user is routed to.
     */
    protected selectedEarliestArrival: Duration | undefined;

    /**
     * Current tab page the user is routed to.
     */
    protected selectedLatestDeparture: Duration | undefined;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The model for the modal.
     */
    protected model: { vehicleGroups: VehicleGroup[], departureTime: DepartureTime, scenario: DepartureTimeScenario; isNew: boolean };

    /**
     * Called when the `Save` button is pressed.
     */
    @bindable
    public onSave: () => void;

    /**
     * Called when the `Cancel` button is pressed.
     */
    @bindable
    public onCancel: () => void;

    /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */
    public activate(model: { vehicleGroups: VehicleGroup[], departureTime: DepartureTime; scenario: DepartureTimeScenario; isNew: boolean }): void
    {
        this.model = { vehicleGroups: model.vehicleGroups, departureTime: model.departureTime, scenario: model.scenario.clone(), isNew: model.isNew };

        if (!model.isNew)
        {
            this.selectedVehicleGroup = model.vehicleGroups.filter(v => v.id === model.scenario.gates[0].slots[0].vehicleGroupId.toString())[0];
            this.reservationInterval = model.scenario.criteria.datePeriod.duration.as("minutes");
            this.selectedEarliestArrival = Duration.fromObject({ seconds: model.scenario.gates[0].slots[0].earliestArrivalTime });
            this.selectedLatestDeparture = Duration.fromObject({ seconds: model.scenario.gates[0].slots[0].latestDepartureTime });
        }
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns True if the stop should be cancelled, otherwise false.
     */
    public deactivate(): DepartureTimeScenario | undefined
    {
        return this._result;
    }

    /**
     * Extract unique gates.
     */
    @computedFrom("model.departureTime")
    protected get gateNames(): string[]
    {
        let gates: Gate[] = [];

        if (this.model.departureTime != null)
        {
            this.model.departureTime.scenarios
                .forEach(s => {
                    s.gates.forEach(g => {
                        if (gates.filter(gate => gate.name === g.name).length === 0)
                        {
                            gates.push(g);
                        }
                    })
                })
        }

        return gates.map(g => g.name);
    }

    /**
     * Extract unique gates.
     */
    @computedFrom("model.departureTime")
    protected get vehicleGroups(): Gate[]
    {
        let gates: Gate[] = [];

        if (this.model.departureTime != null)
        {
            this.model.departureTime.scenarios
                .forEach(s => {
                    s.gates.forEach(g => {
                        if (gates.filter(gate => gate.name === g.name).length === 0)
                        {
                            gates.push(g);
                        }
                    })
                })
        }

        return gates;
    }

    /**
     * Called when the "Save" icon is clicked.
     * Saves changes and transitions the modal to its readonly mode.
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

            this.model.scenario.gates[0].slots = [new GateSlot({
                earliestArrivalTime: this.selectedEarliestArrival?.as("seconds"),
                latestDepartureTime: this.selectedLatestDeparture?.as("seconds"),
                timeBetweenDepartures: this.reservationInterval! * 60,
                vehicleGroupId: this.selectedVehicleGroup?.id
            })];

            // Set the result of the modal.
            this._result = this.model.scenario;

            this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not save the start location", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
