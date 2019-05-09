import { autoinject, bindable } from "aurelia-framework";
import { ImportService } from "../../services/import-service";

/**
 * Represents the module.
 */
@autoinject
export class ImportUploadCustomElement
{
    @bindable protected service: ImportService;

    upload() {
        console.log("Upload now", this.service)
        this.service.currentPage = "success";
    }
}
