import { DateTime } from "luxon";
import { singleton } from "aurelia-framework";
import { once } from "shared/utilities";
import { ICookieOptions } from "./cookie-options";

/**
 * Represents an abstraction around the browsers cookie API.
 */
@singleton()
export class Cookies
{
    private _defaults: ICookieOptions;

    /**
     * Configures the instance.
     * @param defaults The default options used when setting cookies.
     */
    @once
    public configure(defaults: ICookieOptions): void
    {
        this._defaults = defaults;
    }

    /**
     * Gets a map of all cookie values.
     * @returns A map of all cookie values.
     */
    public getAll(): Map<string, string>
    {
        const result = new Map<string, string>();
        const pairs = document.cookie.split(/\s*;\s*/);

        if (pairs[0] === "")
        {
            return result;
        }

        for (const pair of pairs)
        {
            let [name, value] = pair.split(/\s*=\s*/);

            name = decodeURIComponent(name);
            value = decodeURIComponent(value || "");

            result.set(name, value);
        }

        return result;
    }

    /**
     * Gets the value of the specified cookie.
     * @param name The cookie for which the value should be returned.
     * @returns The value for the specified cookie, or undefined if the cookie is not found.
     */
    public get(name: string): string | undefined
    {
        return this.getAll().get(name);
    }

    /**
     * Sets the value for the specified cookie.
     * @param name The cookie for which the value should be set.
     * @param value The value to be set, or undefined to delete the cookie.
     * @param options The options to use when setting the value, where each option overrides the default.
     */
    public set(name: string, value: string | undefined, options?: ICookieOptions): void
    {
        if (typeof name !== "string" || /^\s*$/.test(name))
        {
            throw new Error("The 'name' argument is required.");
        }

        const cookieOptions = { secure: false, sameSite: "lax", ...this._defaults, ...options };

        let cookie = `${encodeURIComponent(name)}=`;

        if (value != null)
        {
            cookie += encodeURIComponent(value);
        }

        if (cookieOptions.domain)
        {
            cookie += `;domain=${cookieOptions.domain}`;
        }

        if (cookieOptions.path)
        {
            cookie += `;path=${cookieOptions.path}`;
        }

        if (cookieOptions.secure)
        {
            cookie += ";secure";
        }

        if (cookieOptions.sameSite)
        {
            cookie += `;samesite=${cookieOptions.sameSite}`;
        }

        if (value != null)
        {
            if (cookieOptions.expires)
            {
                cookie += `;expires=${cookieOptions.expires.toHTTP()}`;
            }
        }
        else
        {
            cookie += `;expires=${DateTime.fromMillis(0).toHTTP()}`;
        }

        document.cookie = cookie;
    }
}
