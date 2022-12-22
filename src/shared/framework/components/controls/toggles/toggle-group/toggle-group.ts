import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { Id } from "shared/utilities";
import { ToggleCustomElement } from "../toggle";

/**
 * Custom element representing a group of toggles.
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
     * The model associated with the active toggle, or if multiple toggles are active, and array
     * of the models associated with the active toggles, or undefined if no toggle is active.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: any | any[];

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
     * True while toggle values are being updated, otherwise false.
     */
    public isUpdatingToggles = false;

    /**
     * Called when a toggle is attached.
     * Adds the toggle as a child of this toggle group.
     * @param toggle The toggle to attach.
     */
    public attachToggle(toggle: ToggleCustomElement): void
    {
        // Add the toggle to the list of toggles.
        this._toggles.push(toggle);
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
     * Called when the specified toggle is activated.
     * Updates the group value to match the new state.
     * @param toggle The toggle being activated.
     */
    public onToggleActivated(toggle: ToggleCustomElement): void
    {
        if (toggle.single)
        {
            this.value = toggle.model;
        }
        else if (this.value instanceof Array)
        {
            if (!this.value.includes(toggle.model))
            {
                this.value = [...this.value, toggle.model];
            }
        }
        else
        {
            this.value = [toggle.model];
        }
    }

    /**
     * Called when the specified toggle is deactivated.
     * Updates the group value to match the new state.
     * @param toggle The toggle being deactivated.
     */
    public onToggleDeactivated(toggle: ToggleCustomElement): void
    {
        if (toggle.model === this.value)
        {
            this.value = undefined;
        }
        else if (this.value instanceof Array)
        {
            const index = this.value.indexOf(toggle.model);

            if (index > -1)
            {
                if (this.value.length > 1)
                {
                    const newValue = [...this.value];
                    newValue.splice(index, 1);
                    this.value = newValue;
                }
                else
                {
                    this.value = undefined;
                }
            }
        }
    }

    /**
     * Called when the model of a toggle changes.
     * If the toggle is active, updates the group value to match the new model.
     * @param newModel The new toggle model.
     * @param oldModel The old toggle model.
     */
    public onToggleModelChanged(newModel: any, oldModel: any): void
    {
        if (this.value !== undefined)
        {
            if (this.value === oldModel)
            {
                this.value = newModel;
            }
            else if (this.value instanceof Array)
            {
                const index = this.value.indexOf(oldModel);

                if (index > -1)
                {
                    const newValue = [...this.value];
                    newValue.splice(index, 1, newModel);
                    this.value = newValue;
                }
            }
        }
    }

    /**
     * Called by the framework when the `value` property changes.
     * Updates the state of the attached toggles.
     */
    protected valueChanged(): void
    {
        this.isUpdatingToggles = true;

        if (this.value instanceof Array)
        {
            for (const toggle of this._toggles)
            {
                toggle.value = this.value.includes(toggle.model);
            }
        }
        else
        {
            for (const toggle of this._toggles)
            {
                toggle.value = this.value === toggle.model;
            }
        }

        this.isUpdatingToggles = false;
    }
}
