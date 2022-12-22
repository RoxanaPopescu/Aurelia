import { autoinject } from "aurelia-framework";

/**
 * Represents the content area of a page.
 *
 * ### How to use:
 * Place this directly within the `page` element, either before or after the `page-sidebar` element.
 * Use `header`, `section` and `footer` elements for content layout.
 */
@autoinject
export class PageContentCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor(element: Element)
    {
        this.element = element as HTMLElement;
    }

    /**
     * The element representing the component.
     */
    protected readonly element: HTMLElement;

    /**
     * Called when the `Back to top` icon is clicked.
     * Scrolls the page back to the top.
     */
    protected onBackToTopClick(): void
    {
        this.element.scrollTo({ top: 0, behavior: "auto" });
    }
}
