import { singleton } from "aurelia-framework";
import { RouterEvent, NavigationInstruction, PipelineResult } from "aurelia-router";
import { EventAggregator } from "aurelia-event-aggregator";

/**
 * Helper service that logs navigation events to the console.
 */
@singleton()
export class LogNavigation
{
    /**
     * Creates a new instance of the type.
     * @param eventAggregator The `EventAggregator` instance.
     */
    public constructor(eventAggregator: EventAggregator)
    {
        eventAggregator.subscribe(RouterEvent.Processing, (event: { instruction: NavigationInstruction }) =>
        {
            const i = event.instruction;
            console.group(`Navigation to '${i.fragment}${i.queryString ? `?${i.queryString}` : ""}'`);
        });

        eventAggregator.subscribe("router:navigation:idle", (event: { result: PipelineResult }) =>
        {
            if (event.result.status === "completed")
            {
                console.info("Navigation completed");
            }
            else if (event.result.output)
            {
                console.error("Navigation failed");
            }
            else
            {
                console.warn("Navigation cancelled");
            }

            console.groupEnd();
        });
    }
}
