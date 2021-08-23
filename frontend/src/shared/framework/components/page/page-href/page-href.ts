import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { HistoryHelper } from "shared/infrastructure";

import "./page-href.scss";

/**
 * Custom attribute used to specify an `href` for an element.
 * The `href` may be assigned to an attribute on the element or a property on its view model,
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

        // Listen for events that should trigger navigation.

        this._element.addEventListener("click", (event: MouseEvent) =>
        {
            // tslint:disable-next-line: no-floating-promises
            this.onElementClickOrEnter(event);
        });

        this._element.addEventListener("keydown", (event: KeyboardEvent) =>
        {
            // Handle the event as a click if the `Enter` key is pressed.
            if (event.key === "Enter")
            {
                // tslint:disable-next-line: no-floating-promises
                this.onElementClickOrEnter(event);
            }
        });
    }

    private readonly _element: (HTMLElement | SVGElement) & { au?: any };
    private readonly _historyHelper: HistoryHelper;
    private _url: string | undefined;

    /**
     * The URL path to set or navigate to when the element is clicked.
     */
    @bindable({ primaryProperty: true })
    public path: string | undefined;

    /**
     * The name of the attribute to set on the element, or null to not set any attribute.
     * The default is `href` if the attribute is applied to an anchor alement, otherwise null.
     */
    @bindable({ defaultBindingMode: bindingMode.oneTime })
    public attribute: string | null;

    /**
     * The name of the property to set on the view model of the element, if applied to a custom element, or null to not set any attribute.
     * The default is `href` if a property with that name is defined on the view model, otherwise null.
     */
     @bindable({ defaultBindingMode: bindingMode.oneTime })
    public property: string | null;

    /**
     * True to navigate when the element is clicked or the `Enter` key is pressed, otherwise false.
     * The default is false if the `href` was assigned to an attribute or property, otherwise true.
     */
     @bindable({ defaultBindingMode: bindingMode.oneTime })
    public navigate: boolean;

    /**
     * True to navigate in a new window, otherwise false.
     * Note that this option only applies when the `navigate` option is true.
     */
    @bindable
    public open: boolean | undefined;

    /**
     * Called by the framework when the component is binding.
     */
    public bind(): void
    {
        // Determine the default value for the `attribute` option.
        this.attribute ??= this._element instanceof HTMLAnchorElement ? "href" : null;

        // Get the view model, if the element is a custom element.
        const viewModel = this._element.au?.controller?.viewModel;

        // Determine the default value for the `property` option.
        this.property ??= viewModel != null && "href" in viewModel ? "href" : null;

        // Determine the default value for the `navigation` option.
        this.navigate ??= this.attribute == null && this.property == null;

        // Ensure this attribute, and the specified attribute and property, is set.
        this.pathChanged();
    }

    /**
     * Called by the framework when the `href` property changes.
     */
    protected pathChanged(): void
    {
        // Ensure this attribute, and the specified attribute and property, is updated.

        this._url = this.path != null ? this.path : undefined;

        this.setAttribute();
        this.setProperty();
        this.setThisAttribute();
    }

    /**
     * Called by the framework when the `open` property changes.
     */
    protected openChanged(): void
    {
        // Ensure this attribute is updated.
        this.setThisAttribute();
    }

    /**
     * Called when the element is clicked, or enter is pressed while the element has keyboard focus.
     * Navigates to the specified `href`.
     * @param event The mouse or keyboard event.
     */
    private async onElementClickOrEnter(event: MouseEvent | KeyboardEvent): Promise<void>
    {
        // Don't handle the event if default has been prevented or it is being repeated.
        if (event.defaultPrevented || (event instanceof MouseEvent && event.detail > 1) || (event instanceof KeyboardEvent && event.repeat))
        {
            return;
        }

        // Don't handle the event if it originated from a nested anchor element with an `href` attribute.
        for (const target of event.composedPath())
        {
            // Only consider targets within the current element.
            if (target === this._element)
            {
                break;
            }

            // Determine whether the target is an anchor element with an `href`.
            if (target instanceof HTMLAnchorElement && target.hasAttribute("href"))
            {
                return;
            }
        }

        // Don't handle the event if navigation is disabled or no `href` is specified.
        if (!this.navigate || this.path == null)
        {
            return;
        }

        // Prevent default for the event, as it will be handled by this attribute.
        event.preventDefault();

        // Determine whether any modifier key is pressed.
        const modifierKeyPressed = event.metaKey || event.shiftKey || event.ctrlKey || event.altKey;

        // Determine whether to navigate in the current window, or open a new window.
        if (this.open || modifierKeyPressed)
        {
            // Open the URL in a new window.
            window.open(this._url, "_blank");
        }
        else
        {
            // Navigate to the specified URL.
            await this._historyHelper.navigate(this.path);
        }
    }

    /**
     * Attempts to set the specified attribute on the element.
     */
    private setAttribute(): void
    {
        if (this.attribute != null)
        {
            // Set or remove the attribute on the element.
            if (this._url != null)
            {
                this._element.setAttribute(this.attribute, this._url);
            }
            else
            {
                this._element.removeAttribute(this.attribute);
            }
        }
    }

    /**
     * Attempts to set the specified property on the view model of the element.
     */
    private setProperty(): void
    {
        if (this.property)
        {
            // Get the view model, if the element is a custom element.
            const viewModel = this._element.au?.controller?.viewModel;

            if (viewModel == null)
            {
                throw new Error("The element does not have a view model.");
            }

            // Set the property on the view model.
            viewModel[this.property] = this._url;
        }
    }

    /**
     * Set this attribute on the element.
     */
    private setThisAttribute(): void
    {
        let attributeName: string;

        // Remove all variations of this attribute.

        for (attributeName of this._element.getAttributeNames())
        {
            if (/^page-href(?:\.|$)/.test(attributeName))
            {
                this._element.removeAttribute(attributeName);
            }
        }

        // Determine whether this attribute is simply used to set the `href` of an anchor element,
        // with no additional options specified.
        const isSimpleAnchor =
            this._element instanceof HTMLAnchorElement &&
            this.attribute === "href" &&
            this.property == null &&
            !this.navigate;

        // If used for more than simply setting the `href` of an anchor element,
        // set the attribute to enable styling based on the attribute options.
        if (!isSimpleAnchor)
        {
            let attributeValue = "";

            if (this._url)
            {
                if (this.attribute != null)
                {
                    // Hide the URL to reduce clutter in the DOM.
                    attributeValue += "path: …";
                }
                else
                {
                    attributeValue += `path: ${this._url}`;
                }
            }

            if (this.attribute != null)
            {
                attributeValue += `; attribute: ${this.attribute}`;
            }

            if (this.property != null)
            {
                attributeValue += `; property: ${this.property}`;
            }

            if (this.navigate)
            {
                attributeValue += `; navigate: ${this.navigate}`;

                if (this.open)
                {
                    attributeValue += "; open: true";
                }
            }

            this._element.setAttribute("page-href", attributeValue);
        }
    }
}
