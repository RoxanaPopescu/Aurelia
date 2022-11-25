import { autoinject } from "aurelia-framework";
import { IdentityService } from "app/services/identity";
import { NotificationService } from "app/modules/notification/services/notification";

/**
 * Represents the topbar of the app.
 */
@autoinject
export class AppTopbarCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     * @param notificationService The `NotificationService` instance.
     */
    public constructor(identityService: IdentityService, notificationService: NotificationService)
    {
        this.identityService = identityService;
        this.notificationService = notificationService;
    }

    /**
     * The `IdentityService` instance.
     */
    protected readonly identityService: IdentityService;

    /**
     * The `NotificationService` instance.
     */
    protected readonly notificationService: NotificationService;
}
