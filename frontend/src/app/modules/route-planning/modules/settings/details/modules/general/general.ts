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

    protected routeNameTempleteInputElement: HTMLElement;
    protected uturnStrategies = Object.keys(UturnStrategy.values).map(key => UturnStrategy.values[key]);
    protected curbApproachStrategy = Object.keys(CurbApproachStrategy.values).map(key => CurbApproachStrategy.values[key]);

    protected onRouteNamePlaceholderClick(placeholder: string): void
    {
        setTimeout(() =>
        {
            this.routeNameTempleteInputElement.focus();
            document.execCommand("insertText", false, placeholder);
        }, 100);
    }
}
