import { autoinject } from "aurelia-framework";
import { activationStrategy } from "aurelia-router";

/**
 * Represents the module.
 */
@autoinject
export class DispatchModule
{
  protected state: string;

    public activate(params: any): void
    {
        this.state = params.state;
    }

    public determineActivationStrategy(): string
    {
        return activationStrategy.replace;
    }
}
