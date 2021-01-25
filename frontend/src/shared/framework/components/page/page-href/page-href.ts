import { autoinject, bindable } from "aurelia-framework";
import { HistoryHelper } from "shared/infrastructure";

import "./page-href.scss";

// Listen for keyboard events and track whether any modifier key is pressed.

let modifierKeyPressed = false;

function onKeyboardEvent(event: KeyboardEvent): void
{
    modifierKeyPressed = event.metaKey || event.shiftKey || event.ctrlKey || event.altKey;
}

window.addEventListener("keydown", onKeyboardEvent, { capture: true, passive: true });
window.addEventListener("keyup", onKeyboardEvent, { capture: true, passive: true });

/**
 * Custom attribute used to specify an href for an element.
 * The href may be assigned to an attribute on the element or a property on its view model,
 * or navigation may be triggered when the element is clicked or the `Enter` key is pressed.
 */
@autoinject
export class PageHrefCustomAttribute
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which this attribute is applied.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(element: Element, historyHelper: HistoryHelper)
    {
        this._element = element as any;
        this._historyHelper = historyHelper;
    }

    private readonly _element: (HTMLElement | SVGElement) & { au?: any };
    private readonly _historyHelper: HistoryHelper;
        private _navigate: boolean;

    /**
     * The URL to set or navigate to when the element is clicked.
     */
    @bindable({ primaryProperty: true })
    public path: string | undefined;

    /**
     * The name of the attribute to set on the element.
     * The default is `href` if the attribute is applied to an `a` alement, otherwise undefined.
     */
    @bindable
    public attribute: string | undefined;

    /**
     * The name of the property to set on the view model of the element, if applied to a custom element.
     * The default is `href`, if a property with that name is defined on the view model, otherwise undefined.
     */
    @bindable
    public property: string | undefined;

    /**
     * True to navigate when the element is clicked or the `Enter` key is pressed, otherwise false.
     * The default is false if the href was assigned to a property, otherwise true.
     */
    @bindable
    public navigate: boolean | undefined;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        // Listen for events that should trigger navigation.

        this._element.addEventListener("click", (event: MouseEvent) =>
        {
            // tslint:disable-next-line: no-floating-promises
            this.onElementClick(event);
        });

        this._element.addEventListener("keydown", (event: KeyboardEvent) =>
        {
            // Handle the event as a click if the `Enter` key is pressed.
            if (event.key === "Enter")
            {
                // tslint:disable-next-line: no-floating-promises
                this.onElementClick(event);
            }
        });
    }

    /**
     * Called by the framework when a property changes.
     */
    protected propertyChanged(): void
    {
        const assignedToAttribute = this.setAttribute();
        const assignedToProperty = this.setProperty();

        // Determine whether navigation should be triggered when the element is clicked or the `Enter` key is pressed.
        this._navigate = this.path != null && (this.navigate === true || (this.navigate == null && !assignedToProperty));

        // Remove the `page-href` attribute if navigation should not be triggered, or if the href was assigned to an attribute.
        // This is needed, because the element is styled as clickable when the `page-href` attribute is present.
        if (!this._navigate && !assignedToAttribute)
        {
            for (const attributeName of this._element.getAttributeNames())
            {
                if (/^page-href(?:\.|$)/.test(attributeName))
                {
                    this._element.removeAttribute(attributeName);
                }
            }
        }
    }

    /**
     * Called when the element is clicked.
     * Navigates to the specified href.
     */
    private async onElementClick(event: Event): Promise<void>
    {
        // Don't handle the event if default has been prevented.
        if (event.defaultPrevented)
        {
            return;
        }

        // Determine whether the target is an anchor with an `href` attribute.
        const targetIsAnchorWithHref = event.target instanceof HTMLAnchorElement && event.target.hasAttribute("href");

        // Don't handle the event if it originated from a nested element,
        // and that nested element is an anchor with an `href` attribute.
        if (targetIsAnchorWithHref && event.target !== this._element)
        {
            return;
        }

        // Do nothing if no href is specified, or if no navigation should be triggered.
        if (!this._navigate)
        {
            return;
        }

        if (modifierKeyPressed || (targetIsAnchorWithHref && this._element.getAttribute("target") === "_blank"))
        {
            // Prevent default for the event, as it will be handled by this attribute.
            event.preventDefault();

            // Open the URL in a new tab or window.
            window.open(this.path!, "_blank");
        }
        else
        {
            // Prevent default for the event, as it will be handled by this attribute.
            event.preventDefault();

            // Navigate to the specified URL.
            await this._historyHelper.navigate(this.path!);
        }
    }

    /**
     * Attempts to set the attribute on the element.
     * @returns True if the attribute was set, otherwise false.
     */
    private setAttribute(): boolean
    {
        // Get the name of the property to set, if any.
        const attribute = this.attribute ?? (this._element instanceof HTMLAnchorElement ? "href" : undefined);

        if (attribute != null)
        {
            if (this.path != null)
            {
                // Set the attribute.
                this._element.setAttribute("href", this.path);
            }
            else
            {
                // Remove the attribute.
                this._element.removeAttribute("href");
            }

            return true;
        }

        return false;
    }

    /**
     * Attempts to set the property on the view model of the element.
     * @returns True if the property was set, otherwise false.
     */
    private setProperty(): boolean
    {
        // Get the view model, if the element is a custom element.
        const viewModel = this._element.au?.controller?.viewModel;

        if (viewModel != null)
        {
            // Get the name of the property to set, if any.
            const property = this.property ?? ("href" in viewModel ? "href" : undefined);

            if (property != null)
            {
                // Set the property.
                viewModel[property] = this.path;

                return true;
            }
        }

        return false;
    }
}
