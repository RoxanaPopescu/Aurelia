import { autoinject, bindable } from "aurelia-framework";
import { Notification } from "../../../../services/notification";

/**
 * Represents an item in a list of notification items.
 */
@autoinject
export class NotificationItemCustomElement
{
    /**
     * The model representing the notification.
     */
    @bindable
    public model: Notification;

    protected onDismissClick(): void
    {
        // Preveenbts default for the event.
    }
}
