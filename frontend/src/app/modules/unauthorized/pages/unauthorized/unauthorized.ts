import { autoinject } from "aurelia-framework";
import { HistoryHelper, setPrerenderStatusCode } from "shared/infrastructure";
import { IdentityService } from "app/services/identity";
import routeStrings from "./resources/strings/route.json";

/**
 * Represents the page.
 */
@autoinject
export class UnauthorizedPage
{
    /**
     * Creates a new instance of the type.
     * @param historyHelper The `HistoryHelper` instance.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(identityService: IdentityService, historyHelper: HistoryHelper)
    {
        this._historyHelper = historyHelper;
        this.identityService = identityService;
    }

    private readonly _historyHelper: HistoryHelper;

    /**
     * The `IdentityService` instance.
     */
    protected readonly identityService: IdentityService;

    /**
     * Called by the framework when the page is activating.
     */
    public activate(): void
    {
        // Set the document title.
        this._historyHelper.setTitle([routeStrings.title]);

        // Set the status code that should be returned to crawlers.
        setPrerenderStatusCode(401);
    }

    /**
     * Called when the `Sign out` button is pressed.
     * Unauthenticates the current user, then navigates to the sign in page.
     */
    protected async onSignOutClick(): Promise<void>
    {
        await this._historyHelper.navigate("/account/sign-out");
    }
}
