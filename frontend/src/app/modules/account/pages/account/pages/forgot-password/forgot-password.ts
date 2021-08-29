import { autoinject } from "aurelia-framework";
import { AccountSubPage } from "../account-sub-page";

@autoinject
export class ForgotPasswordPage extends AccountSubPage
{
    /**
     * Called by the framework when the page is activating.
     */
    public activate(): void
    {
        this.configure({ view: "forgot-password" });
    }
}
