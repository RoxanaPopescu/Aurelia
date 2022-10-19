import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { Placement } from "popper.js";
import { CallbackWithContext } from "shared/types";
import { ItemPickerCustomElement, ModalService } from "shared/framework";
import { AccentColor } from "resources/styles";
import { EditListViewDialog } from "../../modals/edit-list-view/edit-list-view";
import { ConfirmDeleteListViewDialog } from "../../modals/confirm-delete-list-view/confirm-delete-list-view";
import { createListViewDefinition, ListViewDefinition, ListViewService, ListViewType } from "app/model/list-view";

/**
 * Custom element representing an button for creating, opening, editing, or deleting a list view definition.
 */
@autoinject
export class ListViewSelectorCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param modalService The `ModalService` instance.
     * @param listViewService The `ListViewService` instance.
     */
    public constructor(modalService: ModalService, listViewService: ListViewService)
    {
        this._modalService = modalService;
        this._listViewService = listViewService;
    }

    private readonly _modalService: ModalService;
    private readonly _listViewService: ListViewService;

    /**
     * The element representing the button.
     */
    protected buttonElement: HTMLElement;

    /**
     * The view model for the item picker.
     */
    protected itemPicker: ItemPickerCustomElement;

    /**
     * The value of the item that is focused, but not yet picked, or undefined if no item has been focused.
     */
    protected focusedValue: any | undefined;

    /**
     * The type identifying the relevant set of list view definitions.
     */
    @bindable
    public type: ListViewType;

    /**
     * The list view definitions to present.
     */
    @bindable
    public listViewDefinitions:
    {
        personal: ListViewDefinition<any>[];
        shared: ListViewDefinition<any>[];
    };

    /**
     * The function to call when a list view definition is created,
     * before it is persisted.
     */
    @bindable
    public newListViewDefinition: CallbackWithContext<
    {
        /**
         * The list view definition that was created.
         */
         listViewDefinition: ListViewDefinition<any>;
    }>;

    /**
     * The function to call when the host should open a list view.
     */
    @bindable
    public openListView: CallbackWithContext<
    {
        /**
         * The list view definition for which a list view should be opened.
         */
         listViewDefinition: ListViewDefinition<any>;
    }>;

    /**
     * The function to call when the host should delete a list view.
     */
    @bindable
    public closeListView: CallbackWithContext<
    {
        /**
         * The list view definition for which a list view should be deleted.
         */
         listViewDefinition: ListViewDefinition<any>;
    }>;

    /**
     * True if the dropdown is open, otherwise false.
     */
    @bindable({ defaultValue: false, defaultBindingMode: bindingMode.fromView })
    public open: boolean;

    /**
     * True if the button is disabled, otherwise false.
     */
    @bindable({ defaultValue: false })
    public disabled: boolean;

    /**
     * The appearance to use for the button.
     */
    @bindable({ defaultValue: "none" })
    public appearance: "none" | "text" | "outline" | "solid";

    /**
     * The accent color to use for the button, or undefined to use the default.
     */
    @bindable({ defaultValue: undefined })
    public accent: AccentColor;

    /**
     * True to use `fixed` positioning for the dropdown, otherwise false.
     * This may be needed if the dropdown is placed within a container that
     * hides overflowing content, but note that it has a performance cost.
     */
    @bindable({ defaultValue: false })
    public fixed: boolean;

    /**
     * The placement of the dropdown, relative to its owner.
     */
    @bindable({ defaultValue: "bottom-start" })
    public placement: Placement;

    /**
     * Opens the dropdown and optionally focuses the button element.
     * @param focusButton True to focus the button element, otherwise false.
     */
    protected openDropdown(focusButton: boolean): void
    {
        this.open = true;
        this.focusedValue = null;

        setTimeout(() => this.itemPicker?.scrollToFocusedValue());

        if (focusButton)
        {
            setTimeout(() => this.buttonElement.focus());
        }
    }

    /**
     * Closes the dropdown, clears the filter value and optionally focuses the toggle icon.
     * Also reverts the focused value if no value was picked.
     * @param focusToggle True to focus the toggle icon, otherwise false.
     */
    protected closeDropdown(focusToggle: boolean): void
    {
        this.open = false;
        this.focusedValue = null;

        if (focusToggle)
        {
            this.buttonElement.focus();
        }
    }

    /**
     * Called when the toggle icon is clicked, and if filtering is disabled, when the button element is clicked.
     * Toggles the dropdown between its open and closed state, focusing either the button element or toggle icon.
     */
    protected toggleDropdown(): void
    {
        if (this.open)
        {
            this.closeDropdown(true);
        }
        else
        {
            this.openDropdown(true);
        }
    }

    /**
     * Called when a list view definition is clicked.
     * Calls the `SetState` method to apply the state represented by the specified list view definition.
     * @param event The mouse event.
     * @param listViewDefinition The list view definition to apply.
     */
    protected onListViewDefinitionClick(event: MouseEvent, listViewDefinition: ListViewDefinition<any>): void
    {
        if (event.defaultPrevented)
        {
            return;
        }

        this.openListView({ listViewDefinition });
    }

    /**
     * Called when the `Delete` button is pressed on a list view definition.
     * Deletes the specified list view definition.
     * @param event The mouse event.
     * @param listViewDefinition The list view definition to delete.
     */
    protected async onDeleteListViewDefinitionClick(event: MouseEvent, listViewDefinition: ListViewDefinition<any>): Promise<void>
    {
        event.preventDefault();

        const result = await this._modalService.open(ConfirmDeleteListViewDialog, listViewDefinition).promise;

        if (!result)
        {
            return;
        }

        await this._listViewService.delete(listViewDefinition);

        if (listViewDefinition.shared)
        {
            this.listViewDefinitions.shared.splice(this.listViewDefinitions.shared.indexOf(listViewDefinition), 1);
        }
        else
        {
            this.listViewDefinitions.personal.splice(this.listViewDefinitions.personal.indexOf(listViewDefinition), 1);
        }

        this.closeListView({ listViewDefinition });
    }

    /**
     * Called when the `New view` item is clicked.
     * Shows the create dialog, saves the new list view definition, then calls the callback to open a new list view.
     */
    protected async onNewListViewDefinitionClick(): Promise<void>
    {
        let listViewDefinition = createListViewDefinition(this.type);

        const result = await this._modalService.open(EditListViewDialog,
        {
            listViewDefinition: listViewDefinition,
            listViewDefinitions: this.listViewDefinitions
        })
        .promise;

        if (!result)
        {
            return;
        }

        this.newListViewDefinition?.({ listViewDefinition });

        listViewDefinition = await this._listViewService.create(listViewDefinition);

        if (listViewDefinition.shared)
        {
            this.listViewDefinitions.shared.push(listViewDefinition);
            this.listViewDefinitions.shared.sort((a, b) => a.name.localeCompare(b.name));
        }
        else
        {
            this.listViewDefinitions.personal.push(listViewDefinition);
            this.listViewDefinitions.personal.sort((a, b) => a.name.localeCompare(b.name));
        }

        this.openListView({ listViewDefinition });
    }
}
