import { autoinject, bindable } from "aurelia-framework";
import { AppRouter } from "aurelia-router";

import "./module-href.scss";

/**
 * Custom attribute that navigates to the specified path when the element is clicked.
 *
 * ### How to use:
 * Place on the element that should trigger navigation when clicked,
 * and specify the path to navigate to in the options.
 */
@autoinject
export class ModuleHrefCustomAttribute
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which this attribute is applied.
     * @param router The `Router` instance.
     */
    public constructor(element: Element, router: AppRouter)
    {
        this._element = element as HTMLElement;
        this._router = router;
    }

    private readonly _element: HTMLElement;
    private readonly _router: AppRouter;

    /**
     * The path to navigate to when the element is clicked,
     * or undefined to do nothing.
     */
    @bindable
    public path?: string;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        this._element.addEventListener("click", event =>
        {
            if (!event.defaultPrevented)
            {
                // tslint:disable-next-line: no-floating-promises
                this.onElementClick(event);
            }
        });
    }

    /**
     * Called by the framework when the `path` property changes.
     */
    protected pathChanged(): void
    {
        if (this._element instanceof HTMLAnchorElement)
        {
            if (this.path != null)
            {
                this._element.setAttribute("href", this.path);
            }
            else
            {
                this._element.removeAttribute("href");
            }
        }
    }

    /**
     * Called when the element is clicked.
     * Navigates to the specified path.
     */
    private async onElementClick(event: MouseEvent): Promise<void>
    {
        event.preventDefault();

        if (this.path == null)
        {
            return;
        }

        await this._router.navigate(this.path);
    }
}
