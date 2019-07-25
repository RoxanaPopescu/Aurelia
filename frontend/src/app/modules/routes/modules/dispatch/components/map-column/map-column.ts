import { bindable } from "aurelia-framework";
import { Workspace } from "../../services/workspace";

export class MapColumnCustomElement
{
    /**
     * The workspace.
     */
    @bindable
    public workspace: Workspace;
}
