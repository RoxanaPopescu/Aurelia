import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { Placement } from "popper.js";
import { Callback, CallbackWithContext } from "shared/types";
import { ItemPickerCustomElement, ModalService } from "shared/framework";
import { AccentColor } from "resources/styles";
import { LocalStateService } from "app/services/local-state";
import { CreateViewPresetDialog } from "./modals/create-view-preset/create-view-preset";
import { ConfirmDeleteViewPresetDialog } from "./modals/confirm-delete-view-preset/confirm-delete-view-preset";
import { IViewPreset } from "./model/view-preset";

/**
 * Custom element representing an button for creating, picking, or deleting a view preset.
 */
@autoinject
export class ViewPresetSelectorCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param localStateService The `LocalStateService` instance.
     * @param modalService The `ModalService` instance.
     */
    public constructor(localStateService: LocalStateService, modalService: ModalService)
    {
        this._localStateService = localStateService;
        this._modalService = modalService;
    }

    private readonly _localStateService: LocalStateService;
    private readonly _modalService: ModalService;

    /**
     * The presets to present.
     */
    protected presets: IViewPreset[];

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
     * The name of this preset selector, used as a key to identify the relevant set of presets.
     * This should be unique for each view in which the this component is used.
     */
    @bindable
    public name: string;

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
        state: any
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
        this.loadPresets();

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
    protected onPresetClick(event: MouseEvent, preset: IViewPreset): void
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
    protected async onDeletePresetClick(event: MouseEvent, preset: IViewPreset): Promise<void>
    {
        event.preventDefault();

        const result = await this._modalService.open(ConfirmDeleteViewPresetDialog, preset).promise;

        if (!result)
        {
            return;
        }

        this.presets.splice(this.presets.indexOf(preset), 1);

        this.savePresets();
    }

    /**
     * Called when the `Save current view` item is clicked.
     * Shows a dialog asking the user to privide a name for the preset, calls the `GetState` method
     * to get the current view state, and then saves the state as a new preset.
     * @param preset The preset that was clicked.
     */
    protected async onCreatePresetClick(): Promise<void>
    {
        const name = await this._modalService.open(CreateViewPresetDialog).promise;

        if (name == null)
        {
            return;
        }

        this.presets.push({ name, state: this.getState() });

        this.savePresets();
    }

    private loadPresets(): void
    {
        this.presets = this._localStateService.get().viewPresets?.[this.name] ?? [];
    }

    private savePresets(): void
    {
        this._localStateService.mutate(state =>
        {
            (state.viewPresets ??= {})[this.name] = this.presets;
        });
    }
}
