import { autoinject, bindable } from "aurelia-framework";
import { ImportService } from "../../services/import-service";

/**
 * Represents the module.
 */
@autoinject
export class FailedCustomElement
{
    @bindable protected service: ImportService;
}
