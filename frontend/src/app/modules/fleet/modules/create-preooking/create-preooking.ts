import { autoinject } from "aurelia-framework";
import { activationStrategy } from "aurelia-router";

/**
 * Represents the module.
 */
@autoinject
export class CreatePrebookingModule
{
    protected id: string;

    public activate(params: any): void
    {
        this.id = params.id;
    }

    public determineActivationStrategy(): string
    {
        return activationStrategy.replace;
    }
}
