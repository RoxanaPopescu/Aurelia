import { Container, autoinject, bindable, bindingMode } from "aurelia-framework";
import { Id } from "shared/utilities";
import { AccentColor } from "resources/styles";
import { ToggleGroupCustomElement } from "./toggle-group/toggle-group";

/**
 * Represents the base class from which all toggles must inherit.
 */
@autoinject
export class ToggleCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     * @param container The `Container` instance.
     */
    public constructor(element: Element, container: Container)
    {
        this._element = element as HTMLElement;

        // Get the toggle group, if one exists.
        if (container.hasResolver(ToggleGroupCustomElement, true))
        {
            this.toggleGroup = container.get(ToggleGroupCustomElement);
        }
    }

    private readonly _element: HTMLElement;

    /**
     * The goggle group to whihc the toggle belongs, if any.
     */
    protected readonly toggleGroup: ToggleGroupCustomElement | undefined;

    /**
     * The unique ID of the control.
     */
    protected id = Id.sequential();

    /**
     * True if the toggle is a single-select toggle, otherwise false.
     */
    public readonly single: boolean;

    /**
     * The model associated with the toggle.
     */
    @bindable({ defaultValue: undefined })
    public model: any;

    /**
     * True if the toggle is in the active state, false or undefined if the toggle is
     * in the inactive state, or null if the toggle is in the indeterminate state.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: boolean | null | undefined;

    /**
     * True if the toggle is disabled, otherwise false.
     */
    @bindable({ defaultValue: false })
    public disabled: boolean;

    /**
     * True if the toggle is readonly, otherwise false.
     */
    @bindable({ defaultValue: false })
    public readonly: boolean;

    /**
     * The accent color to use for the toggle,
     * or undefined to use the current color.
     */
    @bindable({ defaultValue: undefined })
    public accent: AccentColor;

    /**
     * True to allow toggling to the indeterminate state, otherwise false.
     */
    @bindable({ defaultValue: false })
    public triState: boolean;

    /**
     * Called by the framework when the component is attached.
     * Detaches the toggle from the toggle group.
     */
    public attached(): void
    {
        if (this.toggleGroup != null)
        {
            // If the toggle has no value, set its value based on the group value.
            if (this.value == null && this.toggleGroup.value != null)
            {
                this.value =
                    this.toggleGroup.value === this.model ||
                    (this.toggleGroup.value instanceof Array && this.toggleGroup.value.includes(this.model));
            }

            this.toggleGroup.attachToggle(this);
        }
    }

    /**
     * Called by the framework when the component is detached.
     * Detaches the toggle from the toggle group.
     */
    public detached(): void
    {
        if (this.toggleGroup != null)
        {
            this.toggleGroup.detachToggle(this);
        }
    }

    /**
     * Called by the framework when the `value` property changes.
     * Updates the group value to match the new state.
     */
    protected valueChanged(): void
    {
        if (this.toggleGroup != null && !this.toggleGroup.isUpdatingToggles)
        {
            if (this.value)
            {
                this.toggleGroup.onToggleActivated(this);
            }
            else
            {
                this.toggleGroup.onToggleDeactivated(this);
            }
        }
    }

    /**
     * Called by the framework when the `model` property changes.
     * Updates the group value to match the new state.
     * @param newValue The new property value.
     * @param oldValue The old property value.
     */
    protected modelChanged(newValue: any, oldValue: any): void
    {
        if (this.toggleGroup != null)
        {
            this.toggleGroup.onToggleModelChanged(newValue, oldValue);
        }
    }

    /**
     * Called when the toggle is clicked.
     * Toggels the state of the toggle, dispatches events, and prevents default for the event.
     */
    protected onToggleClick(): boolean
    {
        if (this.disabled || this.readonly)
        {
            return false;
        }

        // Toggle the value.

        if (this.triState)
        {
            switch (this.value)
            {
                case undefined: this.value = true; break;
                case false: this.value = true; break;
                case true: this.value = null; break;
                case null: this.value = false; break;
            }
        }
        else
        {
            this.value = !this.value;
        }

        // Dispatch the `input` event to indicate that the comitted value, has changed.
        this._element.dispatchEvent(new CustomEvent("input", { bubbles: true, detail: { value: this.value } }));

        // Dispatch the `change` event to indicate that the comitted value, has changed.
        this._element.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value: this.value } }));

        return false;
    }
}
