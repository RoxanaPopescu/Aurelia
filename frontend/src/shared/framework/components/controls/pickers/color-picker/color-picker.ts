import { autoinject, bindable, bindingMode } from "aurelia-framework";

/**
 * Custom element representing a picker for picking a theme data color.
 */
@autoinject
export class ColorPickerCustomElement
{
    /**
     * The value of the picked item, or undefined if no item has been picked.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: number;

    /**
     * Called when the user picks an item.
     */
    @bindable({ defaultValue: undefined })
    public pick: () => void;

    /**
     * Called when an item is clicked.
     * Selects the item.
     * @param index The index of the selected item.
     */
    protected onItemClick(index: number): void
    {
        this.value = index;
        this.pick?.();
    }

    /**
     * Called when a key is pressed within the component.
     * Moves the selection to the next or previous item if the arrow keys are pressed.
     * @param event The keyboard event.
     * @returns True to continue, false to prevent default.
     */
    protected onKeyDown(event: KeyboardEvent): boolean
    {
        // Never handle the event if default has been prevented.
        if (event.defaultPrevented)
        {
            return false;
        }

        // Never block special keys or key combinations.
        if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
        {
            return true;
        }

        if ((event.key === "PageUp" || event.key === "End") && this.value < 8)
        {
            this.value = 8;
            this.pick?.();

            return false;
        }

        if ((event.key === "ArrowUp" || event.key === "ArrowRight") && this.value < 8)
        {
            this.value += 1;
            this.pick?.();

            return false;
        }

        if ((event.key === "ArrowDown" || event.key === "ArrowLeft") && this.value > 1)
        {
            this.value -= 1;
            this.pick?.();

            return false;
        }
        if ((event.key === "PageDown" || event.key === "Home") && this.value > 1)
        {
            this.value = 1;
            this.pick?.();

            return false;
        }

        return true;
    }
}
