import { bindable, bindingMode } from "aurelia-framework";
import { textCase } from "shared/utilities";

/**
 * Represents a function that tests an entity to determine whether it matches a filter.
 */
export type FilterFunc<TEntity> = (entity: TEntity) => boolean;

/**
 * Represents a base class for custom elements that implement filter functionality.
 */
export abstract class FilterCustomElement<TEntity>
{
    /**
     * The set of currently active filters.
     */
    protected readonly activeFilters = new Set<string>();

    /**
     * The filter function, which will be assigned to the property to which it is bound.
     * This property is re-assigned when a filter property changes, thereby enabling consumers of the
     * function, such as the `filter` value converter, to react to the change.
     */
    @bindable({ defaultBindingMode: bindingMode.fromView })
    public filterFunc: FilterFunc<TEntity> = this.filter.bind(this);

    /**
     * Sets the filter state based on the specified URL parameter value.
     * @param param The URL parameter value, as a comma-separated list of active filters.
     */
    public fromUrlParam(param: string | undefined): void
    {
        param?.split(/\s*,\s*/)
            .forEach(formattedKey =>
            {
                const parts = formattedKey.split(":", 2);

                this[textCase(parts[0], "kebab", "camel")] = parts.length === 1 ? true : decodeURIComponent(parts[1]);
            });
    }

    /**
     * Gets the URL parameter value representing the filter state.
     * @returns The comma-separated list of active filters.
     */
    public toUrlParam(): string | undefined
    {
        return Array.from(this.activeFilters)
            .map(key =>
            {
                const formattedKey = textCase(key, "camel", "kebab");

                return this[key] === true ? formattedKey : `${formattedKey}:${encodeURIComponent(this[key])}`;
            })
            .join(",") || undefined;
    }

    /**
     * Called by the framework when a property changes.
     * Tracks active filters and re-assigns the filter function, thereby triggering a binding update.
     * @param propertyName The name of the property that changed.
     * @param newValue The new property value.
     * @param oldValue The old property value.
     * @param active True to explicitly indicate that the filter is now active, false to explicitly
     * indicate it is inactive, or undefined to consider it active if the new value is truthy.
     */
    protected propertyChanged(propertyName: string, newValue: any, oldValue: any, active?: boolean): void
    {
        if (propertyName !== "filterFunc")
        {
            if (active ?? newValue)
            {
                this.activeFilters.add(propertyName);
            }
            else
            {
                this.activeFilters.delete(propertyName);
            }

            this.filterFunc = this.filter.bind(this);
        }
    }

    /**
     * When implemented in a derived class, determines whether an entity matches the filters.
     * @param entity The entity to test.
     * @returns True if the entity matches the filters, otherwise false.
     */
    protected abstract filter(entity: TEntity): boolean;
}
