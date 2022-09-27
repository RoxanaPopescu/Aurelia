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
    protected get selectedUturnStrategy(): UturnStrategy | undefined
    {
        return this.settings.restrictions.uturnStrategy
            ? this.availableUturnStrategies.find(s => s.slug === this.settings.restrictions.uturnStrategy.slug)!
            : undefined;
    }

    /**
     * Sets the U-turn strategy.
     */
    protected set selectedUturnStrategy(value: UturnStrategy | undefined)
    {
        this.settings.restrictions.uturnStrategy = value as any;
    }

    /**
     * The available curb-approach strategies.
     */
    protected availableCurbApproachStrategies = Object.keys(CurbApproachStrategy.values).map(slug => new CurbApproachStrategy(slug as any));

    /**
     * Gets the curb-approach strategy.
     */
    @computedFrom("availableCurbApproachStrategies", "settings.restrictions.curbApproachStrategy.slug")
    protected get selectedCurbApproachStrategy(): CurbApproachStrategy | undefined
    {
        return this.settings.restrictions.curbApproachStrategy
            ? this.availableCurbApproachStrategies.find(s => s.slug === this.settings.restrictions.curbApproachStrategy.slug)!
            : undefined;
    }

    /**
     * Sets the curb-approach strategy.
     */
    protected set selectedCurbApproachStrategy(value: CurbApproachStrategy | undefined)
    {
        this.settings.restrictions.curbApproachStrategy = value as any;
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
        const inputElement = (this.routeNameTempleteInputElement.querySelector(".input-input") as HTMLInputElement);

        const text = inputElement.value;

        if (inputElement.selectionStart != null && inputElement.selectionEnd != null)
        {
            inputElement.value = text.substring(0, inputElement.selectionStart) + placeholder + text.substring(inputElement.selectionEnd, text.length);
        }
        else
        {
            inputElement.value = text + placeholder;
        }
    }
}
