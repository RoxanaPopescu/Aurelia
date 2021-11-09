import { singleton, computedFrom, join } from "aurelia-framework";
import { AppRouter, RouterEvent, NavigationInstruction, PipelineResult } from "aurelia-router";
import { EventAggregator } from "aurelia-event-aggregator";
import { History } from "aurelia-history";
import { MapObject } from "shared/types";
import { UrlEncoder, once } from "shared/utilities";
import { setPrerenderStatusCode } from "../prerender";

/**
 * The navigation direction, where `new` represents a navigation to a new history state in the current app instance,
 * `forward` and `backward` represents a navigation to an existing history state in the current app instance,
 * and `refresh` represents a navigation to an existing history state in a new app instance.
 */
export type NavigationDirection = "new" | "forward" | "backward" | "refresh";

/**
 * Represents mutable info about a new or existing history state.
 */
export interface IMutableHistoryState<TParams = MapObject, TData = any>
{
    /**
     * The name identifying the route.
     */
    name: string;

    /**
     * The path pattern for the route, relative to the base path.
     * Note that this may contain dynamic segments.
     */
    path: string;

    /**
     * The parameters for the route, before URL encoding.
     */
    params: TParams;

    /**
     * The fragment in the URL, before URL encoding.
     */
    fragment: string | undefined;

    /**
     * The data associated with the history state.
     */
    data: TData;
}

/**
 * Represents readonly info about an existing history state.
 */
export interface IHistoryState<TParams = MapObject, TData = any> extends Readonly<IMutableHistoryState<TParams, TData>>
{
    /**
     * The absolute URL of the state.
     */
    readonly url: TData;
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
     * True to replace the current history state, false to push a new state.
     */
    replace?: boolean;

    /**
     * The base path to prepend, or undefined to prepend the current base path.
     */
    basePath?: string;
}

/**
 * Represents an alternative base path, for which a `<link rel="alternate" hreflang="..." href="...">`
 * element should be created in the document head.
 */
export interface IAlternateBasePath
{
    /**
     * The locale code for which this base URL should be used.
     */
    localeCode: string;

    /**
     * The base path to use.
     */
    basePath: string;
}

/**
 * Helper service providing methods for interacting with the history and current location.
 */
@singleton()
export class HistoryHelper
{
    /**
     * Creates a new instance of the type.
     * @param history The `History` instance.
     * @param router The `AppRouter` instance.
     * @param eventAggregator The `EventAggregator` instance.
     * @param urlEncoder The `UrlEncoder` instance.
     */
    public constructor(history: History, router: AppRouter, eventAggregator: EventAggregator, urlEncoder: UrlEncoder)
    {
        this._history = history;
        this._router = router;
        this._eventAggregator = eventAggregator;
        this._urlEncoder = urlEncoder;

        let currentState: IHistoryState;

        // Resolve the initial navigation direction immediately, without waiting for the `processing` event.
        this._navigating = this._history.getState("NavigationTracker") != null ? "refresh" : "new";

        this._eventAggregator.subscribe(RouterEvent.Processing, () =>
        {
            // Capture the current state.
            currentState = this._state;

            // Indicate that the app is navigating.
            this._navigating =
                router.isNavigatingBack ? "backward" :
                router.isNavigatingForward ? "forward" :
                router.isNavigatingRefresh ? "refresh" :
                "new";

            // Ensure the current URL is updated to match the current base path,
            // even when navigating in the history after changing the base path.
            this.setBasePath(this._basePath);
        });

        this._eventAggregator.subscribe(RouterEvent.Success, (event: { instruction: NavigationInstruction }) =>
        {
            // Update the history state.
            this._state = this.getHistoryState();

            // Update the document metadata.
            this.updateMetadata(event.instruction);

            // TODO:1: The value we set here should depend on whether the page actually rendered successfully.
            // Set the status code that should be returned to crawlers.
            setPrerenderStatusCode(200);
        });

        this._eventAggregator.subscribe(RouterEvent.Complete, (event: any) =>
        {
            const previous = this.history.previous as IHistoryState[];
            const next = this.history.next as IHistoryState[];

            if (this.navigating === "new")
            {
                if (currentState != null)
                {
                    previous.unshift(currentState);
                }
            }
            else if (this.navigating === "forward")
            {
                next.shift();
                previous.unshift(currentState);
            }
            else if (this.navigating === "backward")
            {
                previous.shift();
                next.unshift(currentState);
            }

            // Indicate that the app is done navigating.
            this._navigating = undefined;

            // Publish an event indicating that the router is now idle.
            this._eventAggregator.publish("router:navigation:idle", event);
        });
    }

    private readonly _history: History;
    private readonly _router: AppRouter;
    private readonly _eventAggregator: EventAggregator;
    private readonly _urlEncoder: UrlEncoder;
    private _basePathPattern: RegExp;
    private _basePath: string;
    private _alternateBasePaths: IAlternateBasePath[] | undefined;
    private _state: IHistoryState;
    private _navigating: NavigationDirection | undefined;

    /**
     * The navigation history.
     */
    public readonly history =
    {
        /**
         * The history states that preceed the current history state.
         */
        previous: [] as ReadonlyArray<IHistoryState>,

        /**
         * The history states that follow the current history state.
         */
        next: [] as ReadonlyArray<IHistoryState>
    };

    /**
     * The base path, relative to the `appBasePath`, with a leading and trailing `/`.
     */
    @computedFrom("_basePath")
    public get basePath(): string
    {
        return this._basePath;
    }

    /**
     * The base path to use when configuring routes, relative to the host, with a leading and trailing `/`.
     */
    @computedFrom("_basePath")
    public get routeBasePath(): string
    {
        return ENVIRONMENT.pushState
            ? `${ENVIRONMENT.appBaseUrl.slice(0, -1)}${(this._basePath)}`
            : this._basePath;
    }

    /**
     * The current history state, or undefined until the initial navigation succeeds.
     */
    @computedFrom("_state")
    public get state(): IHistoryState | undefined
    {
        return this._state;
    }

    /**
     * The direction of the current navigation, or undefined if the app is not currently navigating.
     */
    @computedFrom("_navigating")
    public get navigating(): NavigationDirection | undefined
    {
        return this._navigating;
    }

    /**
     * Configures the instance.
     * @param basePathPattern The pattern used when matching the base path in the current URL,
     * with a leading and trailing `/`. This should match the path between the `appBasePath`,
     * and the beginning of the route.
     */
    @once
    public configure(basePathPattern: RegExp): void
    {
        this._basePathPattern = basePathPattern;

        // Remove any trailing `/` in the current URL.
        this.removeTrailingSlash();

        // Get the current base URL.
        this._basePath = this.getCurrentBasePath();

        // TODO:1: Add link tags to the document head.
        this.updateMetadata();
    }

    /**
     * Sets the base path and replaces the current history URL.
     * Note that if the router has already been configured, the app must be reloaded to update the routes.
     * @param basePath The base path to set, with a leading and trailing `/`.
     * This should be the path between the `appBasePath` and the beginning of the route.
     */
    public setBasePath(basePath: string): void
    {
        // Set the base path.
        this._basePath = basePath;

        // Get the current URL, without any trailing `/`.
        const currentUrl = this.trimTrailingSlash(location.href);

        // Get the current URL, rewritten with the specified base path.
        const alternateUrl = this.getAlternateUrl(basePath);

        // Replace the history URL, if needed.
        if (alternateUrl !== currentUrl)
        {
            history.replaceState(history.state, "", alternateUrl);
        }

        // Update the document metadata.
        this.updateMetadata();
    }

    /**
     * Sets the alternate base paths, for which `<link rel="alternate" hreflang="..." href="...">`
     * elements should be created in the document head.
     * @param alternateBasePaths The alternate base paths to use, with a leading and trailing `/`.
     * This should be the path between the `appBasePath` and the beginning of the route.
     */
    public setAlternateBasePaths(alternateBasePaths: IAlternateBasePath[]): void
    {
        // Set the alternate base paths.
        this._alternateBasePaths = alternateBasePaths;

        // Update the document metadata.
        this.updateMetadata();
    }

    /**
     * Resolves the specified URL, prepending the base URL and base path if it starts with a single `/`.
     * @param url The URL to resolve.
     * @param basePath The base path to use, with a leading and trailing `/`, or undefined to use the current base path.
     * @returns The resolved URL.
     */
    public getRouteUrl(url: string, basePath?: string): string
    {
        // If the URL is absolute or relative to the protocol, return it as-is.
        if (/^\/\/|^[^/?#]+:/.test(url))
        {
            return url;
        }

        let resolvedUrl: string;

        // If the URL is relative to the current path, prepend the current path.
        if (!url.startsWith("/"))
        {
            // TODO:3: Can we fix this so it works for a path-relatieve URL when push-state is disabled?
            if (!ENVIRONMENT.pushState && !/^[/?#]/.test(url))
            {
                throw new Error("Relative routes are not supported when push-state is disabled.");
            }

            resolvedUrl = url.replace(/^[^?#]*/, $0 => join(location.pathname, $0));
        }

        // Else, the URL is relative to the host.
        else
        {
            if (!ENVIRONMENT.pushState)
            {
                // Prepend the base URL, the # character, and the new base path.
                resolvedUrl = `#${(basePath ?? this._basePath).slice(0, -1)}${url}`;
            }
            else
            {
                // Prepend the base URL and the new base path.
                resolvedUrl = `${ENVIRONMENT.appBaseUrl.slice(0, -1)}${(basePath ?? this._basePath).slice(0, -1)}${url}`;
            }
        }

        // Return the URL, without any trailing `/`.
        return this.trimTrailingSlash(resolvedUrl);
    }

    /**
     * Gets the current URL, without the base URL and base path.
     * @returns The current URL, without the base URL and base path.
     */
    public getCurrentRouteUrl(): string
    {
        // Get the current route path, query and hash, without any trailing `/`.
        let url = ENVIRONMENT.pushState
            ? this.trimTrailingSlash(location.pathname) + location.search + location.hash
            : this.trimTrailingSlash(location.hash).substring(1);

        // Remove the base URL.
        if (ENVIRONMENT.pushState && url.startsWith(ENVIRONMENT.appBaseUrl))
        {
            url = url.substring(ENVIRONMENT.appBaseUrl.length - 1);
        }

        // Remove the base path matching the base path pattern.
        url = url.replace(this._basePathPattern, "/");

        return url;
    }

    /**
     * Gets the current URL, rewritten with the specified base path.
     * @param basePath The base path to use, with a leading and trailing `/`, or undefined to use the current base path.
     * @returns The current URL, rewritten with the specified base path.
     */
    public getAlternateUrl(basePath?: string): string
    {
        const url = new URL(location.href);

        if (basePath != null)
        {
            // Get the path and rest.
            // tslint:disable-next-line: prefer-const
            let [path, rest] = ENVIRONMENT.pushState
                ? [url.pathname, undefined]
                : url.hash.substring(1).split(/([?#].*)/);

            // Get the path, with a trailing `/`.
            // This is needed for correct pattern matching.
            path = path.replace(/([^/])$/, "$1/");

            // Remove the base URL.
            if (ENVIRONMENT.pushState && path.startsWith(ENVIRONMENT.appBaseUrl))
            {
                path = path.substring(ENVIRONMENT.appBaseUrl.length - 1);
            }

            // Remove the base path matching the base path pattern.
            path = path.replace(this._basePathPattern, "/");

            // Prepend the new base path.
            path = `${basePath.slice(0, -1)}${path}`;

            if (ENVIRONMENT.pushState)
            {
                // Prepend the base URL, and set the path.
                url.pathname = `${ENVIRONMENT.appBaseUrl.slice(0, -1)}${path}`;
            }
            else
            {
                // Set the path, without the base URL, as the hash.
                url.hash = path + (rest ?? "");
            }
        }

        // Return the alternate URL, without any trailing `/`.
        return this.trimTrailingSlash(url.href);
    }

    /**
     * Navigates back in the history.
     * @param offset The number of states to navigate back, or undefined to navigate a single state.
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
        else
        {
            throw new Error("Offset must be a positive integer or undefined.");
        }
    }

    /**
     * Navigates forward in the history.
     * @param offset The number of states to navigate forward, or undefined to navigate a single state.
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
        else
        {
            throw new Error("Offset must be a positive integer or undefined.");
        }
    }

    /**
     * Navigates to the specified URL.
     * @param url The URL to navigate to.
     * @param options The options to use for the navigation.
     * @returns A promise that will be resolved when the navigation succeeds.
     */
    public async navigate(url: string, options?: IHistoryOptions): Promise<boolean>;

    /**
     * Navigates to a new state, defined by the specified state info.
     * @param state The info describing the state to navigate to.
     * @param options The options to use for the navigation.
     * @returns A promise that will be resolved when the navigation succeeds.
     */
    public async navigate(state: Partial<IHistoryState>, options?: IHistoryOptions): Promise<boolean>;

    /**
     * Navigates to a new state, defined as a mutation of the current state info.
     * @param stateFunc The function that mutates the current state info to produce the new state info.
     * @param options The options to use for the navigation.
     * @returns A promise that will be resolved when the navigation succeeds.
     */
    public async navigate(stateFunc: (state: IMutableHistoryState) => void, options?: IHistoryOptions): Promise<boolean>;

    public async navigate(...args: any[]): Promise<PipelineResult | boolean>
    {
        // Do we need the current instruction?
        const needsInstruction =
            (typeof args[0] === "function") || (typeof args[0] === "object" && !args[0].route);

        // If we need the current instruction, and the router is navigating, wait for navigation to complete.
        if (needsInstruction && this._navigating != null)
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

        if (typeof args[0] === "string")
        {
            // Get the specified, resolved URL.
            const url = this.getRouteUrl(args[0]);

            // Get the options specified in the arguments.
            const options = args[1] as IHistoryOptions;

            // Indicate that navigation has started.
            this._navigating = (options?.trigger ?? true) ? "new" : undefined;

            // Navigate and get the result.
            // tslint:disable-next-line: no-boolean-literal-compare
            const result = this._router.navigate(url, options) !== false;

            // Return the result.
            return result;
        }

        if (typeof args[0] === "function")
        {
            // Get the specified state function.
            const stateFunc = args[0];

            // Get the specified options.
            const options = args[1] as IHistoryOptions;

            // Clone the current state to get a new, mutable history state.
            let state = { ...this.state };
            delete (state as any).url;

            // Call the function specified in the arguments to mutate the state.
            state = stateFunc(state) || state;

            // Navigate and return the result.
            return this.navigate(state, options);
        }

        // tslint:disable-next-line: unnecessary-else
        else
        {
            // Get the specified state object.
            const state = args[0] as IHistoryState;

            // Get the specified options.
            const options = args[1] as IHistoryOptions;

            // Get the URL pattern and params to use.
            const urlPattern = state.path || this.state!.path;
            const urlParams = { ...state.params };

            // Construct the URL.

            let url = urlPattern;

            // Replace the dynamic segments in the URL pattern with parameter values,
            // removing the parameters that are used from the parameter object.

            for (const key of Object.keys(urlParams))
            {
                url = url.replace(new RegExp(`:${key}(/|$)`), ($0: string, $1: string) =>
                {
                    const value = urlParams[key];

                    // tslint:disable-next-line: no-dynamic-delete
                    delete urlParams[key];

                    return `${this._urlEncoder.encodePathSegment(value)}${$1}`;
                });
            }

            // Add any remaining parameters to the query.

            const query = Object.keys(urlParams)
                .filter(key => urlParams[key] !== undefined)
                .map(key => `${this._urlEncoder.encodeQueryKey(key)}=${this._urlEncoder.encodeQueryValue(urlParams[key])}`)
                .join("&");

            if (query)
            {
                url += `?${query}`;
            }

            // Add the fragment, if not empty.

            if (state.fragment)
            {
                url += `#${this._urlEncoder.encodeHash(state.fragment)}`;
            }

            // Indicate that navigation has started.
            this._navigating = (options.trigger ?? true) ? "new" : undefined;

            // Navigate and get the result.
            // tslint:disable-next-line: no-boolean-literal-compare
            const success = this._router.navigate(this.getRouteUrl(url, options.basePath), options) !== false;

            if (success)
            {
                // Set the data associated with the history state.
                this._history.setState("data", state.data);

                // If not triggering navigation, update the current state immediately.
                if (!options.trigger)
                {
                    this._state = this.getHistoryState(state.params);
                }
            }

            // Return the result.
            return success;
        }
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
     * Removes any trailing `/` from the current history URL.
     */
    private removeTrailingSlash(): void
    {
        const url = new URL(location.href);

        if (ENVIRONMENT.pushState)
        {
            if (url.pathname === "/")
            {
                // When there are no path segments, we always see `/` as the path, regardless of
                // whether that `/` is actually present in the URL. So we just always remove it.
                history.replaceState(history.state, "", this.trimTrailingSlash(url.href));

                return;
            }

            // Remove any trailing slash from the path.
            url.pathname = url.pathname.replace(/\/$/, "");
        }
        else
        {
            // Remove any trailing slash from the path.
            url.hash = url.hash.replace(/\/$/, "");
        }

        // Replace the history URL, if needed.
        if (url.href !== location.href)
        {
            history.replaceState(history.state, "", url.href);
        }
    }

    /**
     * Gets the base path of the current URL, matching using the configured base path pattern.
     * @returns The base path of the current URL, with a leading and trailing `/`.
     */
    private getCurrentBasePath(): string
    {
        const url = new URL(location.href);

        // Get the path.
        let path = ENVIRONMENT.pushState ? url.pathname : url.hash.substring(1);

        // Get the path, with a trailing `/`.
        // This is needed for correct pattern matching.
        path = path.replace(/([^/])$/, "$1/");

        let remainder = path;

        // Remove the base URL.
        if (remainder.startsWith(ENVIRONMENT.appBaseUrl))
        {
            remainder = remainder.substring(ENVIRONMENT.appBaseUrl.length - 1);
        }

        // Remove the base path matching the base path pattern.
        remainder = remainder.replace(this._basePathPattern, "/");

        // Return the part of the path that was removed.
        return path.substring(0, path.length - remainder.length + 1);
    }

    /**
     * Updates the document metadata, such as the description, the canoniocal link, and alternate links.
     * @param instruction The navigation instruction for route, if any.
     */
    private updateMetadata(instruction?: NavigationInstruction): void
    {
        // Create or update the canonical link.

        const canonicalUrl = this.getAlternateUrl();

        let canonicalLinkElement = document.head.querySelector("link[rel='canonical']");

        if (canonicalLinkElement == null)
        {
            canonicalLinkElement = document.createElement("link");
            canonicalLinkElement.setAttribute("rel", "canonical");
            document.head.appendChild(canonicalLinkElement);
        }

        canonicalLinkElement.setAttribute("href", canonicalUrl);

        // Create or update the alternate links.

        const alternateLinkElements = Array.from(document.head.querySelectorAll("link[rel='alternate']"));

        if (this._alternateBasePaths != null)
        {
            for (const alternateBasePath of this._alternateBasePaths)
            {
                const alternateUrl = this.getAlternateUrl(alternateBasePath.basePath);

                let alternateLinkElement = alternateLinkElements
                    .find(e => e.getAttribute("hreflang") === alternateBasePath.localeCode);

                if (alternateLinkElement == null)
                {
                    alternateLinkElement = document.createElement("link");
                    alternateLinkElement.setAttribute("rel", "alternate");
                    alternateLinkElement.setAttribute("hreflang", alternateBasePath.localeCode);
                    document.head.appendChild(alternateLinkElement);
                }

                alternateLinkElement.setAttribute("href", alternateUrl);
            }
        }

        for (const alternateLinkElement of alternateLinkElements)
        {
            const localeCode = alternateLinkElement.getAttribute("hreflang");

            if (!this._alternateBasePaths?.some(a => a.localeCode === localeCode))
            {
                alternateLinkElement.remove();
            }
        }

        // Create or update the description meta element.

        if (instruction)
        {
            const instructions = instruction.getAllInstructions();
            const description = instructions.slice().reverse().find(i => i.config.description != null)?.config.description;
            this.setDescription(description);
        }
    }

    /**
     * Gets an object representing the current state info.
     * @param params The parameters used for the navigation, if routing was not triggered.
     * @return An object representing the current state info.
     */
    private getHistoryState(params?: MapObject<string>): IHistoryState
    {
        if (!this._router.currentInstruction)
        {
            throw new Error("Cannot get the current navigation instruction.");
        }

        const result = {} as { -readonly [P in keyof IHistoryState]: IHistoryState[P] };

        const instructions = this._router.currentInstruction.getAllInstructions();

        result.name = instructions
            .filter(i => i.config.name)
            .map(i => i.config.name)
            .join("/");

        result.path = instructions
            .map(i => (i.config.route as string)
                .replace(/^([^/])/, "/$1")
                .replace(/\/\*childRoute(\/|$)/, "$1")
                .replace(/\/$/, ""))
            .join("")
            .substring(this._basePath.length - 1);

        result.params = params ?? instructions.reduce((previous, current) =>
        ({
            ...previous,
            ...(current as any).lifecycleArgs[0]
        }),
        {
            ...this._router.currentInstruction.queryParams
        });

        result.fragment = ENVIRONMENT.pushState
            ? decodeURIComponent(location.hash.substring(1)) || undefined
            : decodeURIComponent(location.hash.replace(/^#.*?#(.*)|^#.*/, "$1")) || undefined;

        result.data = this._history.getState("data");

        result.url = location.href;

        return result;
    }

    /**
     * Trims any trailing `/` from the specified URL.
     * @param url The URL in which any trailing `/` should be trimmed.
     * @returns The URL without a trailing `/`.
     */
    private trimTrailingSlash(url: string): string
    {
        return ENVIRONMENT.pushState
            ? url.replace(/(^[^?#]*)\/(\?|#|$)/, "$1$2")
            : url.replace(/(^.*?#[^?#]*)\/(\?|#|$)/, "$1$2");
    }
}
