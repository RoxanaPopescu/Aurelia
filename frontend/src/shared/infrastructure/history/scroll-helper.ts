import { singleton } from "aurelia-framework";
import { AppRouter, RouterEvent } from "aurelia-router";
import { EventAggregator } from "aurelia-event-aggregator";
import { History } from "aurelia-history";
import { WebStorage } from "../web-storage";
import { EventManager } from "shared/utilities";
import { Disposable } from "shared/types";

/**
 * Helper service that manages various concerns related to scrolling, such as scrolling to the top when navigating to a new
 * history state, and ensuring scroll restoration works reliably when navigating in the history or refreshing the page.
 */
@singleton()
export class ScrollHelper
{
    /**
     * Creates a new instance of the type.
     * @param history The `History` instance.
     * @param router The `AppRouter` instance.
     * @param eventAggregator The `EventAggregator` instance.
     * @param webStorage The `WebStorage` instance.
     */
    public constructor(history: History, router: AppRouter, eventAggregator: EventAggregator, webStorage: WebStorage)
    {
        this._webStorage = webStorage;

        // Load any historic page heights from session storage.
        this.loadHistoricPageHeights();

        let didRestorePageHeight: boolean;

        window.addEventListener("unload", () =>
        {
            // Try to store the page height associated with the current history state.
            this.tryStorePageHeight();

            // Ensure the historic page heights are stored in session storage, before the app unloads.
            this.saveHistoricPageHeights();
        });

        eventAggregator.subscribe(RouterEvent.Processing, () =>
        {
            // Try to store the page height associated with the history state from which the app is navigating.
            this.tryStorePageHeight();

            // Ensure the historic page heights are stored in session storage, so they are available if the window is duplicate.
            this.saveHistoricPageHeights();

            // Get the navigation ID assigned to the new history state by the router.
            this._navigationId = history.getState("NavigationTracker");

            // Try to temporarily restore the page height associated with the history state to which the app is navigating.
            didRestorePageHeight = !router.isNavigatingNew && this.tryRestorePageHeight();
        });

        eventAggregator.subscribe(RouterEvent.Success, () =>
        {
            // Reset the scroll position if navigating to a new history entry.
            if (router.isNavigatingNew)
            {
                this.scrollToTop();
            }
        });

        eventAggregator.subscribe(RouterEvent.Complete, () =>
        {
            // Ensure the temporarily restored page height is cleared, even if no scroll event occurs.
            if (didRestorePageHeight)
            {
                this.schedulePageHeightRelease("timeout", 3000);
            }
        });
    }

    private readonly _webStorage: WebStorage;
    private readonly _eventManager = new EventManager(this);
    private _navigationId: number | undefined;
    private _historicPageHeights: { [navigationId: number]: number };
    private _pageHeightReleaseHandles: Disposable[] = [];

    /**
     * Scrolls to the top of the page.
     */
    private scrollToTop(): void
    {
        console.debug("Scrolling to top of page, due to new navigation");

        // Scroll to the top of the page.
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    /**
     * Loads the historic page heights from session storage.
     */
    private loadHistoricPageHeights(): void
    {
        // Load the historic page heights from session storage, or create a new map.
        this._historicPageHeights = this._webStorage.session.get<any>("historic-page-heights") ?? {};

        if (Object.keys(this._historicPageHeights).length > 0)
        {
            console.debug("Loaded page heights from session storage", { entries: this._historicPageHeights });
        }
    }

    /**
     * Saves the historic page heights to session storage.
     */
    private saveHistoricPageHeights(): void
    {
        if (Object.keys(this._historicPageHeights).length > 0)
        {
            // Save the historic page heights in session storage.
            this._webStorage.session.set("historic-page-heights", this._historicPageHeights);

            console.debug("Saved page heights to session storage", { heights: this._historicPageHeights });
        }
        else
        {
            // Clear the historic page heights saved in session storage.
            this._webStorage.session.set("historic-page-heights", undefined);

            console.debug("Removed page heights in session storage, as there are none");
        }
    }

    /**
     * Tries to store the current page height in the historic page heights.
     */
    private tryStorePageHeight(): void
    {
        if (this._navigationId != null)
        {
            if (document.documentElement.scrollTop > 0)
            {
                console.debug("Storing page height", { navigationId: this._navigationId, height: document.body.scrollHeight });

                // Store the page height in the historic page heights.
                this._historicPageHeights[this._navigationId] = document.body.scrollHeight;
            }
            else if (this._historicPageHeights.hasOwnProperty(this._navigationId))
            {
                console.debug("Removing stored page height, as the page is not scrolled", { navigationId: this._navigationId });

                // Clear the page height stored in the historic page heights.
                // tslint:disable-next-line: no-dynamic-delete
                delete this._historicPageHeights[this._navigationId];
            }
        }
    }

    /**
     * Tries to restore the historic page height, by assigning a `min-height` to the `body` element.
     * @returns True if the height was restored, otherwise false.
     */
    private tryRestorePageHeight(): boolean
    {
        if (this._historicPageHeights.hasOwnProperty(this._navigationId!))
        {
            console.debug("Restoring page height", { navigationId: this._navigationId, height: this._historicPageHeights[this._navigationId!] });

            // Cancel any scheduled clearing of restored page height.
            this.cancelPageHeightRelease();

            // Set the min-height of the page to the stored height.
            document.body.style.minHeight = `${this._historicPageHeights[this._navigationId!]}px`;

            // Clear the temporarily restored page height if a scroll event occurs.
            this._pageHeightReleaseHandles.push(this._eventManager.addEventListener(document, "scroll",
                () => this.schedulePageHeightRelease("scroll", 200), { once: true }));

            return true;
        }

        return false;
    }

    /**
     * Schedules clearing of the restored page height after a timeout.
     * @param reason The reason the restored height was cleared.
     * @param timeout The timeout to use, in milliseconds.
     */
    private schedulePageHeightRelease(reason: "scroll" | "timeout", timeout: number): void
    {
        if (document.body.style.minHeight)
        {
            const timeoutHandle = setTimeout(() => this.releasePageHeight(reason), timeout);
            this._pageHeightReleaseHandles.push(new Disposable(() => clearTimeout(timeoutHandle)));
        }
    }

    /**
     * Cancels any scheduled clearing of the restored page height.
     */
    private cancelPageHeightRelease(): void
    {
        if (this._pageHeightReleaseHandles.length > 0)
        {
            this._pageHeightReleaseHandles.forEach(handle => handle.dispose());
            this._pageHeightReleaseHandles = [];
        }
    }

    /**
     * Releases the page height, by clearing the `min-height` assigned to the `body` element.
     * @param reason The reason the restored height was cleared.
     */
    private readonly releasePageHeight = (reason: "scroll" | "timeout") =>
    {
        this.cancelPageHeightRelease();

        if (document.body.style.minHeight)
        {
            console.debug(`Releasing page height, due to ${reason}`);

            document.body.style.minHeight = "";
        }
    }
}
