import { autoinject } from "aurelia-framework";
import { Workspace } from "./services/workspace";

/**
 * Represents the page.
 */
@autoinject
export class ExpressDispatchPage
{
    protected workspace = new Workspace();
}
