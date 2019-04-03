// tslint:disable: no-invalid-this no-unbound-method

import { DOM } from "aurelia-framework";
import { DefaultLinkHandler, AnchorEventInfo } from "aurelia-history-browser";

// TODO: Remove this when https://github.com/aurelia/history-browser/pull/32 is released.

/**
 * HACK: The `DefaultLinkHandler` attaches a click listener to the document element, which
 * ensures a click on any anchor element activates the router. Unfortunately, it listens
 * for this event in the `capture` phase, which means no other handlers will ever get a
 * chance to handle the event.
 * Therefore, we override the `activate` method to change the event listener to listen
 * for the event in the `bubble` phase instead.
 */
DefaultLinkHandler.prototype.activate = function(history: any): void
{
    if (history._hasPushState)
    {
        (this as any).history = history;
        DOM.addEventListener("click", (this as any).handler, false);
    }
};

/**
 * HACK: The `DefaultLinkHandler` does not consider whether `preventDefault()` has been
 * called on the event, which means it is impossible to prevent the route change.
 * Therefore, we override the static `getEventInfo` method to change the behavior,
 * such that events are not handled by the router if default has been prevented.
 */
const getEventInfoFunc = DefaultLinkHandler.getEventInfo;
DefaultLinkHandler.getEventInfo = function(event: Event): AnchorEventInfo
{
    if (event.defaultPrevented)
    {
        return { shouldHandleEvent: false, href: null, anchor: null } as any;
    }

    // Continue with the original method.
    return getEventInfoFunc.apply(this, arguments as any);
};
