import { autoinject } from "aurelia-framework";
import { Workspace } from "./services/workspace";

/**
 * Represents the page.
 */
@autoinject
export class DispatchPage
{
    protected workspace = new Workspace();

    protected column = "merge";
}
