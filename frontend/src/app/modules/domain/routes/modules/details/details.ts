import { autoinject } from "aurelia-framework";

/**
 * Represents the module.
 */
@autoinject
export class DetailsModule
{
    protected id: string;

    public activate(params: any): void
    {
        this.id = params.id;
    }
}
