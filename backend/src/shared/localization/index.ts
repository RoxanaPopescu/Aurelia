import path from "path";
import parentModule from "parent-module";
import acceptLanguage from "accept-language";
import { getRequestHeaders } from "../../app/middleware/headers-middleware";
import { MapObject } from "../types";
import settings from "../../resources/settings/settings";

// Set the supported locale codes.
acceptLanguage.languages([settings.app.defaultLocaleCode, ...settings.app.supportedLocaleCodes]);

const cache = new Map<string, MapObject<string>>();

/**
 * Gets the supported locale code that best matches the requested locale code.
 * @returns The locale code to use when handling the current request.
 */
export function getResolvedLocaleCode(): string
{
    // Get the request headers.
    const requestHeaders = getRequestHeaders();

    // Resolve the locale code to use, based on the request headers.
    return acceptLanguage.get(requestHeaders.localeCode)!;
}

/**
 * Gets the strings from the specified JSON file, translated for the current locale.
 * @param jsonFilePath The file path for the JSON file containing the strings.
 * @returns An object representing the specified JSON file, translated for the current locale.
 */
export function getStrings(jsonFilePath: string): MapObject<string>
{
    // Get the locale code to use, based on the request headers.
    const localeCode = getResolvedLocaleCode();

    // Resolve the directory path of the module calling this function.
    const parentModuleDirPath = path.dirname(parentModule()!);

    // Construct the cache key.
    const cacheKey = `${parentModuleDirPath}|${jsonFilePath}`;

    // Try to get the strings from the cache.
    let result = cache.get(cacheKey);

    // If not found in the cache, construct and cache a new object.
    if (result == null)
    {
        // Resolve the absolute path of the specified JSON file.
        const absoluteJsonFilePath = path.resolve(parentModuleDirPath, jsonFilePath);

        // If the locale code matches the default locale code, just return the requested JSON file.
        if (localeCode === settings.app.defaultLocaleCode)
        {
            return require(absoluteJsonFilePath);
        }

        // Get all translations for the current locale code.
        const translatedStrings = require(`../../resources/translations/${localeCode}.json`) as MapObject<string>;

        // Get the path prefix identifying keys related to the specified JSON file.
        const translationKeyPrefix = `./${path.relative(path.resolve(__dirname, "../../"), absoluteJsonFilePath).slice(0, -5)}`;

        // Get the translation keys related to the specified JSON file.
        const translationKeys = Object.keys(translatedStrings).filter(key => key.startsWith(`${translationKeyPrefix}:`));

        // Get the requested JSON file.
        const sourceStrings = require(absoluteJsonFilePath) as MapObject<string>;

        // Construct an object containing only the translation keys related to the specified JSON file.

        result = {} as MapObject<string>;

        for (const translationKey of translationKeys)
        {
            const jsonFileKey = translationKey.slice(translationKeyPrefix.length + 1);

            result[jsonFileKey] = translatedStrings[translationKey] || sourceStrings[jsonFileKey];
        }

        // Add the new object to the cache.
        cache.set(cacheKey, result);
    }

    return result;
}
