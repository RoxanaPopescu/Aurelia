import { bindable } from "aurelia-framework";

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
    protected onSurfaceClick(): void
    {
        this.expanded = true;
    }
}
