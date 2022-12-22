import { autoinject, computedFrom } from "aurelia-framework";
import { once, textCase } from "shared/utilities";
import { LocaleService } from "shared/localization";
import { IGoogleMapsSettings } from "./google-maps-settings";

// The base URL to use when constructing the URL for the Google Maps API script.
const apiBaseUrl = "https://maps.googleapis.com/maps/api/js";

// The promise that will be resolved when the Google Maps API is loaded.
let googleMapsApiPromise: Promise<typeof google.maps> | undefined;

/**
 * Represents a service for managing the Google Maps API.
 */
@autoinject
export class GoogleMapsService
{
    /**
     * Creates a new instance of the type.
     * @param localeService The `LocaleService` instance.
     */
    public constructor(localeService: LocaleService)
    {
        this._localeService = localeService;
    }

    private readonly _localeService: LocaleService;
    private _settings: IGoogleMapsSettings;

    /**
     * Gets the current settings.
     */
    @computedFrom("_settings")
    public get settings(): IGoogleMapsSettings
    {
        return this._settings;
    }

    /**
     * Configures the instance.
     * @param settings The settings to use.
     */
    @once
    public configure(settings: IGoogleMapsSettings): void
    {
        this._settings = settings;
    }

    /**
     * Loads the Google Maps API, using the specified options.
     * @param options The options to use when constructing the URL for the Google Maps API script.
     * @returns A promise that will be resolved with the `google.maps` namespace.
     */
    public async load(): Promise<typeof google.maps>
    {
        if (googleMapsApiPromise == null)
        {
            if (this.settings == null)
            {
                throw new Error("Cannot load the Google Maps API before the service is configured.");
            }

            const parameters =
            {
                callback: "__googleMapsApiCallback",
                language: this._localeService.locale.code,
                timeout: 10000,
                ...this.settings.parameters
            };

            googleMapsApiPromise = new Promise((resolve, reject) =>
            {
                // Reject the promise after a timeout.

                const timeoutHandle = setTimeout(() =>
                {
                    window[parameters.callback] = () => undefined;

                    reject(new Error("Could not load the Google Maps API"));

                }, parameters.timeout);

                // Create the callback function.

                window[parameters.callback] = () =>
                {
                    if (timeoutHandle !== null)
                    {
                        clearTimeout(timeoutHandle);
                    }

                    resolve(window.google.maps);

                    // tslint:disable-next-line: no-dynamic-delete
                    delete window[parameters.callback];
                };

                // Create the script element to inject.

                const scriptElement = document.createElement("script");
                const scriptUrl = new URL(apiBaseUrl);

                for (const key of Object.keys(parameters))
                {
                    if (parameters[key])
                    {
                        const value = parameters[key] instanceof Array
                            ? parameters[key].join(",")
                            : parameters[key];

                        const name = textCase(key, "camel", "snake");

                        scriptUrl.searchParams.set(name, value);
                    }
                }

                scriptElement.src = scriptUrl.href;

                // Inject the script element.

                document.body.appendChild(scriptElement);
            });
        }

        return googleMapsApiPromise;
    }
}
