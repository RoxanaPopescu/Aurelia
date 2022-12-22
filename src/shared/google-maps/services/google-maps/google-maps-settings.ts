/**
 * Represents settings related to the Google Maps integration.
 */
export interface IGoogleMapsSettings
{
    /**
     * The parameters to use when constructing the URL for the Google Maps API script.
     */
    parameters: IGoogleMapsParameters;

    /**
     * The default options to use when creating a new Google Map instance, if any.
     */
    defaults?: IGoogleMapsOptions;
}

/**
 * The options to use when creating a new Google Map instance.
 */
export interface IGoogleMapsOptions extends google.maps.MapOptions
{
    /**
     * The map ID to use, or undefined to use the default.
     */
    mapId?: string;
}

/**
 * The parameters to use when constructing the URL for the Google Maps API script.
 * Note that all option names should be specified using camel-case.
 * See: https://developers.google.com/maps/documentation/javascript/url-params
 * See: https://developers.google.com/maps/documentation/javascript/styling
 */
export interface IGoogleMapsParameters
{
    /**
     * Your Google Maps API key.
     * Note that the API will not load unless a valid API key is specified.
     */
    key: string;

    /**
     * The name of a global function to be called once the API has loaded,
     * or undefined to use the default.
     */
    callback?: string;

    /**
     * The version of the API to use, or undefined to use the latest.
     */
    v?: string;

    /**
     * The identifiers for the additional libraries to load,
     * or undefined to load no additional libraries.
     */
    libraries?: string[];

    /**
     * The language to use, or undefined to use the default.
     * This affects the names of controls, copyright notices, driving directions, and control labels,
     * as well as the responses to service requests.
     */
    language?: string;

    /**
     * The region code to use, or undefined to use the default.
     * This alters the map's behavior based on a given country or territory.
     */
    region?: string;

    /**
     * The timeout in milliseconds, after which the attempt to load the API is considered a failure.
     */
    timeout?: number;

    /**
     * The map IDs to load, or undefined to load the default.
     */
    mapIds?: string[];

    /**
     * Any additional parameters you may need to specify.
     */
    [key: string]: any;
}
