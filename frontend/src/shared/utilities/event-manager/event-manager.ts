import { Disposable } from "shared/types";

/**
 * Represents a manager for DOM event listeners, providing a convenient API
 * for subscribing and unsubscribing, while tracking the subscriptions so
 * they can be easily disposed all at once.
 */
export class EventManager
{
    /**
     * Creates a new instance of the type.
     * @param owner The instance that should be used as `this` when calling the callbacks.
     */
    public constructor(owner: object)
    {
        this._owner = owner;
    }

    private readonly _owner: object;
    private readonly _subscriptions = new Set<Disposable>();

    /**
     * Adds the specified callback as a listener for the specified events,
     * and tracks it so it can be removed when this instance is disposed.
     * @param element The element to which the listener should be attached.
     * @param eventOrEvents The event or events to listen for.
     * @param callback The callback to call when the event occurs.
     * @param options The listener options.
     * @returns A disposable, which when disposed removes the listener.
     */
    public addEventListener(element: Document | Element, eventOrEvents: string | string[], callback: (event: Event) => any, options?: EventListenerOptions): Disposable
    {
        const subscriptions: Disposable[] = [];

        const events = typeof eventOrEvents === "string" ? [eventOrEvents] : eventOrEvents;

        for (const event of events)
        {
            const boundCallback = callback.bind(this._owner);

            element.addEventListener(event, boundCallback, options);

            const subscription = new Disposable(() => element.removeEventListener(event, boundCallback, options));

            subscriptions.push(subscription);
            this._subscriptions.add(subscription);
        }

        return new Disposable(() =>
        {
            for (const subscription of subscriptions)
            {
                subscription.dispose();
                this._subscriptions.delete(subscription);
            }
        });
    }

    /**
     * Removes all event listeners tracked by this instance.
     */
    public removeEventListeners(): void
    {
        for (const subscription of this._subscriptions)
        {
            subscription.dispose();
            this._subscriptions.delete(subscription);
        }
    }
}
