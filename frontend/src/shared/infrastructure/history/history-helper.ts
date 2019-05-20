import { MapObject } from "shared/types";
import { singleton, computedFrom } from "aurelia-framework";
import { History } from "aurelia-history";
import { Router, PipelineResult } from "aurelia-router";
import { EventAggregator } from "aurelia-event-aggregator";

// The separator used between segments of a route name.
export const routeNameSeparator = "/";

/**
 * Represents info about a new or existing history state.
 */
export interface IHistoryState
{
    /**
     * The name of the route.
     */
    route: string;

    /**
     * The parameters for the route.
     */
    params: MapObject;

    /**
     * The fragment in the URL.
     */
    fragment: string | undefined;

    /**
     * The data associated with the state in the browser history.
     */
    data: any;
}

/**
 * Represents the options to use during navigation.
 */
export interface IHistoryOptions
{
    /**
     * True ro trigger routing and lifecycle methods, false to only change the location.
     */
    trigger?: boolean;

    /**
     * True to replace the current state in the browser history, false to push a new state.
     */
    replace?: boolean;
}

/**
 * Helper service providing methods for interacting with the browser history and current location.
 */
@singleton()
export class HistoryHelper
{
    /**
     * Creates a new instance of the type.
     * @param history The `History` instance.
     * @param router The `Router` instance.
     * @param eventAggregator The `EventAggregator` instance.
     */
    public constructor(history: History, router: Router, eventAggregator: EventAggregator)
    {
        this._history = history;
        this._router = router;
        this._eventAggregator = eventAggregator;

        this._eventAggregator.subscribe("router:navigation:processing", () =>
        {
            this._navigating = true;
        });

        this._eventAggregator.subscribe("router:navigation:success", () =>
        {
            this._state = this.getState();
        });

        this._eventAggregator.subscribe("router:navigation:complete", (event: any) =>
        {
            this._navigating = false;

            this._eventAggregator.publish("router:navigation:idle", event);
        });
    }

    private readonly _history: History;
    private readonly _router: Router;
    private readonly _eventAggregator: EventAggregator;
    private _navigating = true;
    private _state: IHistoryState;

    /**
     * True if the router is navigating, otherwise false.
     */
    @computedFrom("_navigating")
    public get navigating(): boolean
    {
        return this._navigating;
    }

    /**
     * The current history state.
     * Note that this will be undefined until the initial navigation succedes.
     */
    @computedFrom("_state")
    public get state(): IHistoryState
    {
        return this._state;
    }

    /**
     * Navigates back in the browser history.
     * @param offset The number of states to navigate back.
     */
    public navigateBack(offset?: number): void
    {
        if (offset == null)
        {
            history.back();
        }
        else if (offset > 0)
        {
            history.go(-offset);
        }

        throw new Error("Offset must be a positive integer or undefined.");
    }

    /**
     * Navigates forward in the browser history.
     * @param offset The number of states to navigate forward.
     */
    public navigateForward(offset?: number): void
    {
        if (offset == null)
        {
            history.forward();
        }
        else if (offset > 0)
        {
            history.go(offset);
        }

        throw new Error("Offset must be a positive integer or undefined.");
    }

    /**
     * Navigates to the specified URL.
     * @param url The URL to navigate to.
     * @param options The options to use for the navigation.
     * @returns A promise that will be resolved when the navigation succeedes.
     */
    public async navigate(url: string, options?: IHistoryOptions): Promise<boolean>;

    /**
     * Navigates to a new state, defined by the specified state info.
     * @param state The info describing the state to navigate to.
     * @param options The options to use for the navigation.
     * @returns A promise that will be resolved when the navigation succeedes.
     */
    public async navigate(state: Partial<IHistoryState>, options?: IHistoryOptions): Promise<boolean>;

    /**
     * Navigates to a new state, defined as a mutation of the current state info.
     * @param state The function that mutates the current state info to produce the new state info.
     * @param options The options to use for the navigation.
     * @returns A promise that will be resolved when the navigation succeedes.
     */
    public async navigate(state: (state: IHistoryState) => void, options?: IHistoryOptions): Promise<boolean>;

    public async navigate(...args: any[]): Promise<PipelineResult | boolean>
    {
        // Do we need the current instruction?
        const needsInstruction =
            (typeof args[0] === "function") || (typeof args[0] === "object" && !args[0].route);

        // If we need the current instruction, and the router is navigating, wait for navigation to complete.
        if (needsInstruction && this._navigating)
        {
            return new Promise<boolean>((resolve, reject) =>
            {
                this._eventAggregator.subscribeOnce("router:navigation:idle", (event: any) =>
                {
                    // Only continue if the navigation succeeded.
                    if (event.result.completed)
                    {
                        this.navigate.apply(this, args).then(resolve).catch(reject);
                    }
                    else
                    {
                        resolve(false);
                    }
                });
            });
        }

        // Push or replace the state as requested.

        const options = args[1];

        if (typeof args[0] === "string")
        {
            const url = args[0];

            return this._router.navigate(url, options);
        }
        else if (typeof args[0] === "function")
        {
            let state = this.state;
            state = args[0](state) || state;

            return this.navigate(state, options);
        }
        else
        {
            const state = args[0];

            let url = this._router.generate(state.route || this.state.route, state.params);

            if (state.fragment)
            {
                url += `#${encodeURIComponent(state.fragment).replace(/%2F/g, "/").replace(/%3F/g, "?")}`;
            }

            const success = this._router.navigate(url, options) !== false;

            if (success)
            {
                if (state.data)
                {
                    this._history.setState("data", state.data);
                }
            }

            return success;
        }
    }

    /**
     * Handler for the navigation success event, which gets the current state info.
     * @return An object representing the current state info.
     */
    private getState(): IHistoryState
    {
        if (!this._router.currentInstruction)
        {
            throw new Error("Cannot get the current navigation instruction.");
        }

        const instructions = this._router.currentInstruction.getAllInstructions();

        const route = instructions.map(i => i.config.name).join(routeNameSeparator);

        const params = instructions.reduce((previous, current) =>
        ({
            ...previous,
            ...(current as any).lifecycleArgs[0]
        }),
        this._router.currentInstruction.queryParams);

        const fragment = location.hash.substring(1) || undefined;

        const data = this._history.getState("data");

        return { route, params, fragment, data };
    }
}
