import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents a container for the primary content of a page.
 *
 * ### How to use:
 * Place directly within the view being presented int the `router-view`.
 * When scoping styles, use a selector such as `page[name="example"]`.
 */
@autoinject
export class PageCustomElement
{
    /**
     * The name of the page.
     * Note that this should be unique among the pages in the app.
     */
    @bindable
    public name: string;
}
