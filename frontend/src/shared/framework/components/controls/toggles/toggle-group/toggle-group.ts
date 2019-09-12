import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { Id } from "shared/utilities";
import { ToggleCustomElement } from "../toggle";

/**
 * Custom element representing a group of toggles,
 * in which at most one toggle may be active.
 */
@autoinject
export class ToggleGroupCustomElement
{
    private readonly _toggles: ToggleCustomElement[] = [];

    /**
     * The unique ID of the control.
     */
    protected id = Id.sequential();

    /**
     * The model associated with the active toggle, or undefined if no toggle is active.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: any;

    /**
     * True if the toggle group is disabled, otherwise false.
     */
    @bindable({ defaultValue: false })
    public disabled: boolean;

    /**
     * True if the toggle group is readonly, otherwise false.
     */
    @bindable({ defaultValue: false })
    public readonly: boolean;

    /**
     * Called when a toggle is attached.
     * Adds the toggle as a child of this toggle group.
     * @param toggle The toggle to attach.
     */
    public attachToggle(toggle: ToggleCustomElement): void
    {
        // Add the toggle to the list of toggles.
        this._toggles.push(toggle);

        // If the toggle is active, set its model as the current value.
        if (toggle.value)
        {
            this.value = toggle.model;
        }
    }

    /**
     * Called when a toggle is detached.
     * Removes the toggle as a child of this toggle group.
     * @param toggle The toggle to detach.
     */
    public detachToggle(toggle: ToggleCustomElement): void
    {
        // Try to find the toggle in the list of toggles.
        const index = this._toggles.indexOf(toggle);

        // Do nothing if the toggle was not found.
        if (index > -1)
        {
            // Remove the toggle from the list of toggles.
            this._toggles.splice(this._toggles.indexOf(toggle), 1);
        }
    }

    /**
     * Changes the value of the toggle group to the specified value.
     * @param value The new value.
     */
    public changeValue(value: any): void
    {
        this.value = value;
    }

    /**
     * Called by the framework when the `value` property changes.
     * Updates the active state of the attached toggles.
     */
    protected valueChanged(): void
    {
        for (const toggle of this._toggles)
        {
            toggle.value = this.value === toggle.model;
        }
    }
}
