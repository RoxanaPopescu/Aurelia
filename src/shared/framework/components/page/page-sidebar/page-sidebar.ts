import { bindable } from "aurelia-framework";

// The expanded state associated with each `page-sidebar` name.
const storedExpandedStates = new Map<string, boolean>();

/**
 * Represents the sidebar area of a page.
 *
 * ### How to use:
 * Place this directly within the `page` element, either before or after the `page-content` element.
 * Use `header`, `section` and `footer` elements for content layout.
 */
export class PageSidebarCustomElement
{
    /**
     * True if the sidebar is expanded, otherwise false.
     */
    @bindable
    public expanded = true;

    /**
     * The name of the sidebar, used for storing its expanded state,
     * or undefined to not store the state.
     */
    @bindable
    public name: string | undefined;

    /**
     * Called by the framework when the component is binding.
     * Sets the initial expanded state, if previously stored.
     */
    public bind(): void
    {
        if (this.name && storedExpandedStates.has(this.name))
        {
            this.expanded = storedExpandedStates.get(this.name)!;
        }
    }

    /**
     * Called when the edge of the sidebar is clicked.
     * Toggles whether the sidebar is expanded.
     * @param event The mouse event.
     */
    protected onEdgeClick(event: MouseEvent): void
    {
        this.expanded = !this.expanded;
        event.stopPropagation();
    }

    /**
     * Called when the surface of the sidebar is clicked.
     * Ensures the sidebar is expanded.
     */
    protected onSurfaceClick(): boolean
    {
        this.expanded = true;

        return true;
    }

    /**
     * Called by the framework when the `expanded` property changes.
     * Updates the stored the expanded state.
     */
    protected expandedChanged(): void
    {
        if (this.name)
        {
            storedExpandedStates.set(this.name, this.expanded);
        }
    }
}
