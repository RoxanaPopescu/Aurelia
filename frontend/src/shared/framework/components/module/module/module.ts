import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents a container for the primary content of a module view.
 *
 * ### How to use:
 * Place directly within the `app-content` element, of if the module is nested,
 * directly within the `template` element for the module view.
 * When scoping styles, use a selector such as `module[name="example"]`.
 * If the module is nested, also include parent modules in the selector.
 */
@autoinject
export class ModuleCustomElement
{
    /**
     * The name of the module.
     * Note that this should be unique among the modules in the app.
     */
    @bindable
    public name: string;
}
