import { autoinject, bindable } from "aurelia-framework";
import { ImportService } from "../../services/import-service";

/**
 * Represents the module.
 */
@autoinject
export class SuccessCustomElement
{
    @bindable protected service: ImportService;
}
