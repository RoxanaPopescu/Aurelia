import { MapObject } from "shared/types";

// Import the icons module, which at this point should already be loaded.
let icons: MapObject<string>;
import("./icons").then(module => icons = module.default);

/**
 * The prefix that must be used when specifying icon names.
 * This enables us to more easily search for icon names in the code.
 */
export const iconNamePrefix = "ico-";

/**
 * Resolves the ID of the specified icon.
 * @param name The name identifying the icon, which must start with the icon name prefix.
 * @returns The ID of the specified icon, or the ID of the `missing` icon if not found.
 */
export function resolveIconId(name: string): string
{
    if (icons == null)
    {
        throw new Error("The icons must be loaded before calling this method.");
    }

    let path: string;

    if (name.startsWith(iconNamePrefix))
    {
        path = icons[name.substring(iconNamePrefix.length)];

        if (path == null)
        {
            console.error(`The icon name '${name}' has not been mapped to any icon.`);

            path = icons["ico-missing"] ?? "missing";
        }
    }
    else
    {
        console.error(`The icon name '${name}' must start with the '${iconNamePrefix}' prefix.`);

        path = icons["ico-missing"] ?? "missing";
    }

    return path.replaceAll("/", "-");
}
