import { autoinject, observable, computedFrom } from "aurelia-framework";
import { ISorting, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState } from "shared/infrastructure";
import { IScroll, ModalService } from "shared/framework";
import { CommunicationService, CommunicationTriggerEventSlug, CommunicationMessageTypeSlug, CommunicationTriggerInfo, CommunicationRecipientSlug } from "app/model/_communication";
import { ConfirmDeleteTriggerDialog } from "./modals/confirm-delete-trigger/confirm-delete-trigger";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    sortProperty?: string;
    sortDirection?: SortingDirection;
    triggerEvent?: string;
    messageType?: string;
    text?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param communicationService The `CommunicationService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(communicationService: CommunicationService, historyHelper: HistoryHelper, modalService: ModalService)
    {
        this._communicationService = communicationService;
        this._historyHelper = historyHelper;
        this._modalService = modalService;
        this._constructed = true;
    }

    private readonly _communicationService: CommunicationService;
    private readonly _historyHelper: HistoryHelper;
    private readonly _modalService: ModalService;
    private readonly _constructed;

    /**
     * The scroll manager for the page.
     */
    protected scroll: IScroll;

    /**
     * The most recent update operation.
     */
    protected updateOperation: Operation;

    /**
     * The sorting to use for the table.
     */
    @observable({ changeHandler: "update" })
    protected sorting: ISorting =
    {
        property: "name",
        direction: "descending"
    };

    /**
     * The text in the filter text input.
     */
    @observable({ changeHandler: "update" })
    protected textFilter: string | undefined;

    /**
     * The trigger event filter.
     */
    @observable({ changeHandler: "update" })
    protected triggerEventFilter: CommunicationTriggerEventSlug[] | undefined;

    /**
     * The message type filter.
     */
    @observable({ changeHandler: "update" })
    protected messageTypeFilter: CommunicationMessageTypeSlug[] | undefined;

    /**
     * The message recipient filter.
     */
    @observable({ changeHandler: "update" })
    protected recipientFilter: CommunicationRecipientSlug[] | undefined;

    /**
     * The items to present in the table.
     */
    protected triggers: CommunicationTriggerInfo[];

    @computedFrom("triggers", "sorting", "textFilter", "triggerEventFilter", "messageTypeFilter")
    protected get orderedAndFilteredTriggers(): CommunicationTriggerInfo[]
    {
        if (this.triggers == null)
        {
            return [];
        }

        const offset = this.sorting.direction === "ascending" ? 1 : -1;

        return this.triggers

            // Filtering
            .filter(t => this.triggerEventFilter && this.triggerEventFilter.includes(t.triggerEvent.slug))
            .filter(t => this.messageTypeFilter && this.messageTypeFilter.includes(t.messageType.slug))
            .filter(t => this.recipientFilter && this.recipientFilter.includes(t.recipient.slug))
            .filter(t => !this.textFilter || t.searchModel.contains(this.textFilter))

            // Sorting
            .sort((a, b) =>
            {
                // tslint:disable: no-eval
                const aPropertyValue = eval(`a.${this.sorting.property}`);
                const bPropertyValue = eval(`b.${this.sorting.property}`);
                // tslint:enable

                // Sort by selected column and direction.
                if (aPropertyValue < bPropertyValue) { return -offset; }
                if (aPropertyValue > bPropertyValue) { return offset; }

                return 0;
            });
    }

    /**
     * Called by the framework when the module is activated.
     * @param params The trigger parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public activate(params: IRouteParams): void
    {
        this.sorting.property = params.sortProperty || this.sorting.property;
        this.sorting.direction = params.sortDirection || this.sorting.direction;
        this.triggerEventFilter = params.triggerEvent ? params.triggerEvent.split(",") as any : this.triggerEventFilter;
        this.messageTypeFilter = params.messageType ? params.messageType.split(",") as any : this.messageTypeFilter;
        this.textFilter = params.text || this.textFilter;

        this.update();
    }

    /**
     * Called by the framework when the module is deactivated.
     * @returns A promise that will be resolved when the module is activated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }
    }

    /**
     * Updates the page by fetching the latest data.
     */
    protected update(newValue?: any, oldValue?: any, propertyName?: string): void
    {
        // Return if the object is not constructed.
        // This is needed because the `observable` decorator calls the change handler when the
        // initial property value is set, which happens before the constructor is called.
        if (!this._constructed)
        {
            return;
        }

        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }

        // Create and execute the new operation.
        this.updateOperation = new Operation(async signal =>
        {
            // Fetch the data.
            const result = await this._communicationService.getAll(signal);

            // Update the state.
            this.triggers = result;

            // Scroll to top.
            this.scroll.reset();

            // tslint:disable-next-line: no-floating-promises
            this._historyHelper.navigate((state: IHistoryState<IRouteParams>) =>
            {
                state.params.sortProperty = this.sorting ? this.sorting.property : undefined;
                state.params.sortDirection = this.sorting ? this.sorting.direction : undefined;
                state.params.triggerEvent = this.triggerEventFilter?.join(",");
                state.params.messageType = this.messageTypeFilter?.join(",");
                state.params.text = this.textFilter || undefined;
            },
            { trigger: false, replace: true });
        });
    }

    /**
     * Called when the `Delete trigger` icon is clicked on trigger.
     * Asks the user to confirm, then deletes the trigger from the list.
     * @param trigger The trigger to delete.
     */
    protected async onDeleteTriggerClick(trigger: CommunicationTriggerInfo): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmDeleteTriggerDialog, trigger).promise;

        if (!confirmed)
        {
            return;
        }

        // Delete thge trigger.
        await this._communicationService.delete(trigger.slug);

        // Remove the trigger from the list, and force an update.
        this.triggers = [...this.triggers.splice(this.triggers.indexOf(trigger), 1)];
    }

}
