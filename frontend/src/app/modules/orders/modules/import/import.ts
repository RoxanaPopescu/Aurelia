import { autoinject } from "aurelia-framework";
import { ImportService } from "./services/import-service";

/**
 * Represents the module.
 */
@autoinject
export class ImportModule
{
    protected service = new ImportService();
}
