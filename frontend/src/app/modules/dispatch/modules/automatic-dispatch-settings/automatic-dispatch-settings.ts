import { AutomaticDispatchService } from "app/model/automatic-dispatch";
import { autoinject } from "aurelia-framework";

/**
 * Represents the module.
 */
@autoinject
export class AutomaticDispatchSettingsModule
{
    public constructor(automaticDispatchService: AutomaticDispatchService)
    {
        this.automaticDispatchService = automaticDispatchService;
    }

    protected automaticDispatchService: AutomaticDispatchService;

    public activate(): void
    {
    }
}
