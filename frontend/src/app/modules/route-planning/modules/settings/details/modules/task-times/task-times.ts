import { autoinject, bindable } from "aurelia-framework";
import { ModalService, IValidation } from "shared/framework";
import { RoutePlanningSettings, TaskTimesAdditionalTime, TaskTimesRoundDefinition } from "app/model/_route-planning-settings";
import { ConfirmDeleteScenarioDialog } from "./modals/confirm-delete-scenario/confirm-delete-scenario";
import { AdditionalTaskTimePanel } from "./modals/additional-task-time-panel/additional-task-time-panel";
import { BaseTaskTimePanel } from "./modals/base-task-time-panel/base-task-time-panel";
import { RoundDefinitionPanel } from "./modals/round-definition-panel/round-definition-panel";

/**
 * Represents the page.
 */
@autoinject
export class TaskTimes
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
     * The validation for the base task time.
     */
    protected baseTaskTimeValidation: IValidation;

    /**
     * The validation for the round definition.
     */
    protected roundDefinitionValidation: IValidation;

    /**
     * The id of the routeplan settings
     */
    @bindable
    public settings: RoutePlanningSettings;

    /**
     * Called when the "Edit round definition" icon is clicked.
     * Opens the modal for editing the round definition.
     */
    protected async onEditRoundDefinitionClick(): Promise<void>
    {
        const model = this.settings.taskTimes.roundDefinition || new TaskTimesRoundDefinition();
        const result = await this._modalService.open(RoundDefinitionPanel, model).promise;

        if (result != null)
        {
            this.settings.taskTimes.roundDefinition = result;
        }

        // Validate the form.
        await this.roundDefinitionValidation.validate();
    }

    /**
     * Called when the "Edit base task time" icon is clicked.
     * Opens the modal for editing the base task time.
     */
    protected async onEditBaseTaskTimeClick(): Promise<void>
    {
        const model = this.settings.taskTimes.base || new TaskTimesAdditionalTime();
        const result = await this._modalService.open(BaseTaskTimePanel, model).promise;

        if (result != null)
        {
            this.settings.taskTimes.base = result;
        }

        // Validate the form.
        await this.baseTaskTimeValidation.validate();
    }

    /**
     * Called when the "Edit rule" icon is clicked on a task time rule.
     * Opens the modal for editing the task time rule.
     * @param index The index of the rule.
     */
    protected async onEditAdditionalTaskTimeClick(index: number): Promise<void>
    {
        const model = this.settings.taskTimes.scenarios[index];
        const result = await this._modalService.open(AdditionalTaskTimePanel, model).promise;

        if (result != null)
        {
            this.settings.taskTimes.scenarios.splice(index, 1, result);
        }
    }

    /**
     * Called when the "Add rule" icon is clicked on a task time rule.
     * Opens the modal for editing the task time rule.
     */
    protected async onAddAdditionalTaskTimeClick(index: number): Promise<void>
    {
        const result = await this._modalService.open(AdditionalTaskTimePanel).promise;

        if (result != null)
        {
            this.settings.taskTimes.scenarios.push(result);
        }
    }

    /**
     * Called when the "Delete rule" icon is clicked on a task time rule.
     * Asks for confirmation, then deletes the task time rule.
     * @param index The index of the rule.
     */
    protected async onDeleteAdditionalTaskTimeClick(index: number): Promise<void>
    {
        if (!await this._modalService.open(ConfirmDeleteScenarioDialog).promise)
        {
            return;
        }

        this.settings.taskTimes.scenarios.splice(index, 1);
    }
}
