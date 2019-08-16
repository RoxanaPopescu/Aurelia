import { autoinject } from "aurelia-framework";
import { activationStrategy } from "aurelia-router";

/**
 * Represents the module.
 */
@autoinject
export class AssignRoutesModule
{
    protected origin: string;
    protected ids: string;

    public activate(params: any): void
    {
        this.origin = params.origin;
        this.ids = params.ids;
    }

    public determineActivationStrategy(): string
    {
        return activationStrategy.replace;
    }
}
