import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { RoutePlanningSettings, UturnStrategy, CurbApproachStrategy } from "app/model/_route-planning-settings";

/**
 * Represents the page.
 */
@autoinject
export class General
{
    /**
     * The route name template input element.
     */
    protected routeNameTempleteInputElement: HTMLElement;

    /**
     * The available U-turn strategies.
     */
    protected availableUturnStrategies = Object.keys(UturnStrategy.values).map(slug => new UturnStrategy(slug as any));

    /**
     * Gets the U-turn strategy.
     */
    @computedFrom("availableUturnStrategies", "settings.restrictions.uturnStrategy.slug")
    protected get selectedUturnStrategy(): UturnStrategy
    {
        return this.availableUturnStrategies.find(s => s.slug === this.settings.restrictions.uturnStrategy.slug)!;
    }

    /**
     * Sets the U-turn strategy.
     */
    protected set selectedUturnStrategy(value: UturnStrategy)
    {
        this.settings.restrictions.uturnStrategy = value;
    }

    /**
     * The available curb-approach strategies.
     */
    protected availableCurbApproachStrategies = Object.keys(CurbApproachStrategy.values).map(slug => new CurbApproachStrategy(slug as any));

    /**
     * Gets the curb-approach strategy.
     */
    @computedFrom("availableCurbApproachStrategies", "settings.restrictions.curbApproachStrategy.slug")
    protected get selectedCurbApproachStrategy(): CurbApproachStrategy
    {
        return this.availableCurbApproachStrategies.find(s => s.slug === this.settings.restrictions.curbApproachStrategy.slug)!;
    }

    /**
     * Sets the curb-approach strategy.
     */
    protected set selectedCurbApproachStrategy(value: CurbApproachStrategy)
    {
        this.settings.restrictions.curbApproachStrategy = value;
    }

    /**
     * The route planning rule set.
     */
    @bindable
    public settings: RoutePlanningSettings;

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
