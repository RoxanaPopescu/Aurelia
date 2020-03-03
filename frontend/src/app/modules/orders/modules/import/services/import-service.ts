import { autoinject } from "aurelia-framework";
import { ImportError } from "../../../../../model/import/entities/import-error";

/**
 * Service that controls that active import screen and network
 */
@autoinject
export class ImportOrdersService
{
    public currentPage: "upload" | "failed" = "upload";
    public importErrors: ImportError[] | undefined = undefined;
}
