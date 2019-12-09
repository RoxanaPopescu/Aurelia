import { autoinject, bindable } from "aurelia-framework";
import { ImportOrdersService } from "../../services/import-service";

/**
 * Represents the module.
 */
@autoinject
export class ImportFailedCustomElement
{
    @bindable protected service: ImportOrdersService;
}
