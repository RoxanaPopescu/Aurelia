import { autoinject } from "aurelia-framework";
import { ImportService } from "./services/import-service";

/**
 * Represents the module.
 */
@autoinject
export class ImportModule
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor()
    {
        this.service.currentPage = "failed";
    }
    protected service = new ImportService();
}
