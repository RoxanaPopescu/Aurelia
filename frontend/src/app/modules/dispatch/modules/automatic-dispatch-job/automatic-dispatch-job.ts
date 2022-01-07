import { AutomaticDispatchService } from "app/model/automatic-dispatch";
import { autoinject } from "aurelia-framework";

/**
 * Represents the module.
 */
@autoinject
export class AutomaticDispatchJobModule
{
    public constructor(
        automaticDispatchService: AutomaticDispatchService)
    {
        this.automaticDispatchService = automaticDispatchService;
    }

    protected automaticDispatchService: AutomaticDispatchService;
    protected id: string;

    public activate(params: any): void
    {
        this.id = params.id;
    }
}
