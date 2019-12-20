import { autoinject, bindable } from "aurelia-framework";

/**
 * Custom element representing the toggle icon for a dropdown,
 * intended to be placed within a button or input.
 */
@autoinject
export class DropdownIconCustomElement
{
    /**
     * The function to call when the icon is toggled.
     */
    @bindable
    public toggle: () => void;

    /**
     * True if the dropdown is open, otherwise false.
     */
    @bindable({ defaultValue: false })
    public open: boolean;

    /**
     * Called when a key is pressed within the component.
     * Toggles if the `Enter` key is pressed.
     * @param event The keyboard event.
     * @returns True to continue, false to prevent default.
     */
    protected onKeyDown(event: KeyboardEvent): boolean
    {
        if (event.defaultPrevented)
        {
            return true;
        }

        if (event.key === "Enter" && !(event.altKey || event.metaKey || event.shiftKey || event.ctrlKey))
        {
            if (this.toggle != null)
            {
                this.toggle();
            }

            return false;
        }

        return true;
    }

    /**
     * Called when a mousedown event occurs on the icon.
     * Calls the `toggle` method to indicate that the dropdown shoulds open or close.
     */
    protected onMouseDown(): void
    {
        if (this.toggle != null)
        {
            this.toggle();
        }
    }

    /**
     * Called when a click event occurs on the icon.
     * Does nothing, but is needed to prevent default on the event.
     */
    protected onClick(): void
    {
        // Do nothing.
    }
}
