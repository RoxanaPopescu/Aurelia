import { singleton, computedFrom } from "aurelia-framework";
import { History } from "aurelia-history";
import { AppRouter, NavigationInstruction, PipelineResult } from "aurelia-router";
import { EventAggregator } from "aurelia-event-aggregator";
import { MapObject } from "shared/types";

// The separator used between segments of a route name.
export const routeNameSeparator = "/";

/**
 * Represents info about a new or existing history state.
 */
export interface IHistoryState<TParams = MapObject, TData = any>
{
    /**
     * The path for the route, which may contain dynamic segments.
     */
    path: string;

    /**
     * The parameters for the route.
     */
    params: TParams;

    /**
     * The fragment in the URL.
     */
    fragment: string | undefined;

    /**
     * The data associated with the state in the browser history.
     */
    data: TData;
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
     * @param router The `AppRouter` instance.
     * @param eventAggregator The `EventAggregator` instance.
     */
    public constructor(history: History, router: AppRouter, eventAggregator: EventAggregator)
    {
        this._history = history;
        this._router = router;
        this._eventAggregator = eventAggregator;

        let isNavigatingNew = false;

        this._eventAggregator.subscribe("router:navigation:processing", () =>
        {
            this._navigating = true;
            isNavigatingNew = router.isNavigatingNew;
        });

        this._eventAggregator.subscribe("router:navigation:success", (event: { instruction: NavigationInstruction }) =>
        {
            this._state = this.getState();

            // Set the content of the `description` meta element.
            const instructions = event.instruction.getAllInstructions();
            const description = instructions.slice().reverse().find(i => i.config.description != null)?.config.description;
            this.setDescription(description);

            // Reset the scroll position if navigating to a new history entry.
            if (isNavigatingNew)
            {
                window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            }
        });

        this._eventAggregator.subscribe("router:navigation:complete", (event: any) =>
        {
            isNavigatingNew = false;
            this._navigating = false;

            this._eventAggregator.publish("router:navigation:idle", event);
        });
    }

    private readonly _history: History;
    private readonly _router: AppRouter;
    private readonly _eventAggregator: EventAggregator;
    private _state: IHistoryState;
    private _navigating = true;

    /**
     * The current history state.
     * Note that this will be undefined until the initial navigation succeedes.
     */
    @computedFrom("_state")
    public get state(): IHistoryState
    {
        return this._state;
    }

    /**
     * True if the router is navigating, otherwise false.
     */
    @computedFrom("_navigating")
    public get navigating(): boolean
    {
        return this._navigating;
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
            // tslint:disable-next-line: no-shadowed-variable
            const url = args[0];

            return this._router.navigate(url, options);
        }

        if (typeof args[0] === "function")
        {
            // tslint:disable-next-line: no-shadowed-variable
            let state = { ...this.state };

            state = args[0](state) || state;

            return this.navigate(state, options);
        }

        const state = args[0];

        const urlPattern = state.url || this.state.path;
        const urlParams = { ...state.params };

        let url = urlPattern;

        for (const key of Object.keys(urlParams))
        {
            url = url.replace(new RegExp(`:${key}(/|$)`), ($0: string, $1: string) =>
            {
                const value = urlParams[key];

                // tslint:disable-next-line: no-dynamic-delete
                delete urlParams[key];

                return `${value}${$1}`;
            });
        }

        const query = Object.keys(urlParams)
            .filter(key => urlParams[key] !== undefined)
            .map(key => `${key}=${urlParams[key].toString()}`).join("&");

        if (query)
        {
            url += `?${query}`;
        }

        if (state.fragment)
        {
            url += `#${encodeURIComponent(state.fragment).replace(/%2F/g, "/").replace(/%3F/g, "?")}`;
        }

        // tslint:disable-next-line: no-boolean-literal-compare
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

    /**
     * Sets the title of the document, either as a single title, as multiple titles joined by a separator,
     * ending with the separator and title defined in the `AppRouter`. If the specified title is undefined,
     * the title of the current navigation instruction will be used.
     * @param titles The title or title path to set, or undefined to use the title of the current navigation instruction.
     * @param separator The separator to use, or undefined to use the separator defined in the `AppRouter`.
     */
    public setTitle(title?: string | string[], separator?: string): void
    {
        if (title instanceof Array)
        {
            document.title =
            [
                title.join(separator ?? this._router.titleSeparator),
                this._router.title
            ]
            .join(this._router.titleSeparator);
        }
        else if (title != null)
        {
            document.title = title;
        }
        else
        {
            this._router.updateTitle();
        }
    }

    /**
     * Sets description of the document.
     * @param description The description to set.
     */
    public setDescription(description: string): void
    {
        let metaDescriptionElement = document.head.querySelector("meta[name='description']");

        if (metaDescriptionElement == null)
        {
            metaDescriptionElement = document.createElement("meta");
            metaDescriptionElement.setAttribute("name", "description");
            document.head.appendChild(metaDescriptionElement);
        }

        metaDescriptionElement.setAttribute("content", description ?? "");
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

        const path = instructions.map(i => (i.config.route as string).replace("/*childRoute", "")).join(routeNameSeparator);

        const params = instructions.reduce((previous, current) =>
        ({
            ...previous,
            ...(current as any).lifecycleArgs[0]
        }),
        this._router.currentInstruction.queryParams);

        const fragment = location.hash.substring(1) || undefined;

        const data = this._history.getState("data");

        return { path, params, fragment, data };
    }
}
