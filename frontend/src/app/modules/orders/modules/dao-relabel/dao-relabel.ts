import { autoinject } from "aurelia-framework";

/**
 * Represents the module.
 */
@autoinject
export class DaoRelabelPage
{
    /**
     * Creates a new instance of the class.
     */
    public constructor()
    {

    }


    /**
     * Called when the XXX
     */
    protected async onPrintClick(): Promise<void>
    {
        var iframe: any = document.getElementById("testPdf");
        iframe.focus();
        iframe.contentWindow.print();
    }
}
