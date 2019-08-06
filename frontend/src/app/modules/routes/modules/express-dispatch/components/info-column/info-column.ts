import { autoinject, bindable } from "aurelia-framework";
import { Workspace } from "../../services/workspace";

@autoinject
export class InfoColumnCustomElement
{
    /**
     * The workspace.
     */
    @bindable
    protected workspace: Workspace;

    protected onBackClick(): void
    {
        history.back();
    }
}
