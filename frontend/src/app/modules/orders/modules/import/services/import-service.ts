import { autoinject } from "aurelia-framework";

/**
 * Service that controls that active import screen and network
 */
@autoinject
export class ImportService
{
    public currentPage: "upload" | "failed" = "failed";
}
