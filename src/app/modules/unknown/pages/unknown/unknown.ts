import { autoinject } from "aurelia-framework";
import { HistoryHelper, setPrerenderStatusCode } from "shared/infrastructure";
import routeStrings from "./resources/strings/route.json";

/**
 * Represents the page.
 */
@autoinject
export class UnknownPage
{
    /**
     * Creates a new instance of the type.
     * @param historyHelper The `HistoryHelper` instance.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(historyHelper: HistoryHelper)
    {
        this._historyHelper = historyHelper;
    }

    private readonly _historyHelper: HistoryHelper;

    /**
     * Called by the framework when the page is activating.
     */
    public activate(): void
    {
        // Set the document title.
        this._historyHelper.setTitle([routeStrings.title]);

        // Set the status code that should be returned to crawlers.
        setPrerenderStatusCode(404);
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
