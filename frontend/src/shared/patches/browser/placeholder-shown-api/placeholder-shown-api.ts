import "./placeholder-shown-api.scss";

document.addEventListener("animationstart", e =>
{
    if (e.animationName === "on-placeholder-shown")
    {
        (e.target as any).placeholderShown = true;
    }

    if (e.animationName === "on-placeholder-hidden")
    {
        (e.target as any).placeholderShown = false;
    }
},
{ capture: true });

declare global
{
    interface IPlaceholderShown
    {
        /**
         * Indicates whether the element is currently presenting placeholder content.
         *
         * **WARNING:**
         * This is a non-standard property. The value is inferred based on animation
         * events triggered by the CSS pseudo-class `:placeholder-shown`.
         */
        placeholderShown?: boolean;
    }

    // tslint:disable: interface-name no-empty-interface
    interface HTMLInputElement extends IPlaceholderShown {}
    interface HTMLTextareaElement extends IPlaceholderShown {}
    interface HTMLSelectElement extends IPlaceholderShown {}
    // tslint:enable
}
