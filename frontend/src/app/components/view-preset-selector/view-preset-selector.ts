import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { Placement } from "popper.js";
import { Callback, CallbackWithContext } from "shared/types";
import { ItemPickerCustomElement, ModalService } from "shared/framework";
import { AccentColor } from "resources/styles";
import { CreateViewPresetDialog } from "./modals/create-view-preset/create-view-preset";
import { ConfirmDeleteViewPresetDialog } from "./modals/confirm-delete-view-preset/confirm-delete-view-preset";
import { ViewPreset, ViewPresetService, ViewPresetType } from "app/model/view-presets";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";

/**
 * Custom element representing an button for creating, picking, or deleting a view preset.
 */
@autoinject
export class ViewPresetSelectorCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param modalService The `ModalService` instance.
     * @param viewPresetService The `ViewPresetService` instance.
     */
    public constructor(modalService: ModalService, viewPresetService: ViewPresetService)
    {
        this._modalService = modalService;
        this._viewPresetService = viewPresetService;
    }

    private readonly _modalService: ModalService;
    private readonly _viewPresetService: ViewPresetService;

    /**
     * The shared presets to present.
     */
    protected sharedPresets: ViewPreset[];

    /**
     * The local presets to present.
     */
    protected localPresets: ViewPreset[];

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
     * The type identifying the relevant set of presets.
     */
    @bindable
    public type: ViewPresetType;

    /**
     * The function to call to get the current state of the view.
     *
     */
    @bindable
    public getState: Callback<any>;

    /**
     * The function to call to set the current state of the view.
     */
    @bindable
    public setState: CallbackWithContext<
    {
        /**
         * The state to set as the current view state.
         */
        state: any;
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
     * Called by the framework when the component is attached to the DOM.
     */
    public attached(): void
    {
        const fetchOperation = new Operation(async signal =>
        {
            const result = await this._viewPresetService.getAll(this.type, signal);

            this.sharedPresets = result.shared;
            this.localPresets = result.local;
        });

        fetchOperation.promise.catch(error => Log.error("Could not get the views for the organization.", error));
    }

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
     * Called when a preset is clicked.
     * Calls the `SetState` method to apply the state represented by the specified preset.
     * @param event The mouse event.
     * @param preset The preset to apply.
     */
    protected onPresetClick(event: MouseEvent, preset: ViewPreset): void
    {
        if (event.defaultPrevented)
        {
            return;
        }

        this.setState({ state: preset.state });
    }

    /**
     * Called when the `Delete` button is pressed on a preset.
     * Deletes the specified preset.
     * @param event The mouse event.
     * @param preset The preset to delete.
     */
    protected async onDeletePresetClick(event: MouseEvent, preset: ViewPreset): Promise<void>
    {
        event.preventDefault();

        const result = await this._modalService.open(ConfirmDeleteViewPresetDialog, preset).promise;

        if (!result)
        {
            return;
        }

        await this._viewPresetService.delete(preset);

        if (preset.shared)
        {
            this.sharedPresets.splice(this.sharedPresets.indexOf(preset), 1);
        }
        else
        {
            this.localPresets.splice(this.localPresets.indexOf(preset), 1);
        }
    }

    /**
     * Called when the `Save current view` item is clicked.
     * Shows a dialog asking the user to privide a name for the preset, calls the `GetState` method
     * to get the current view state, and then saves the state as a new preset.
     * @param preset The preset that was clicked.
     */
    protected async onCreatePresetClick(): Promise<void>
    {
        const result = await this._modalService.open(CreateViewPresetDialog,
        {
            type: this.type,
            sharedPresets: this.sharedPresets,
            localPresets: this.localPresets
        })
        .promise;

        if (result == null)
        {
            return;
        }

        const preset = await this._viewPresetService.create(
        {
            type: this.type,
            shared: result.shared,
            name: result.name,
            state: this.getState()
        });

        if (result.shared)
        {
            this.sharedPresets.push(preset);
        }
        else
        {
            this.localPresets.push(preset);
        }
    }
}
