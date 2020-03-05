import { autoinject, bindable } from "aurelia-framework";
import { RoutePlanningSettings, UturnStrategy, CurbApproachStrategy } from "app/model/_route-planning-settings";

/**
 * Represents the page.
 */
@autoinject
export class General
{
    /**
     * The id of the routeplan settings
     */
    @bindable
    protected settings: RoutePlanningSettings;

    /**
     * The route name template input element.
     */
    protected routeNameTempleteInputElement: HTMLElement;

    /**
     * The available U-turn strategies.
     */
    protected uturnStrategies = Object.keys(UturnStrategy.values).map(key => UturnStrategy.values[key]);

    /**
     * The available curb-approach strategies.
     */
    protected curbApproachStrategies = Object.keys(CurbApproachStrategy.values).map(key => CurbApproachStrategy.values[key]);

    /**
     * Called when a route name template placeholder is clicked.
     * Inserts the placeholder into the route name template input.
     * @param placeholder The placeholder text to insert.
     */
    protected onRouteNamePlaceholderClick(placeholder: string): void
    {
        setTimeout(() =>
        {
            this.routeNameTempleteInputElement.focus();
            document.execCommand("insertText", false, placeholder);
        });
    }
}
