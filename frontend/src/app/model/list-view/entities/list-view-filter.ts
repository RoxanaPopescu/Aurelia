import { AnyPropertyChangedHandler } from "shared/types";

/**
 * Represents a filter for a list view.
 */
export abstract class ListViewFilter
{
    /**
     * Called by the framework when an observable property changes.
     * Note that this will be assigned by the `ListView` class.
     */
    public update: AnyPropertyChangedHandler | undefined;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return this;
    }
}
