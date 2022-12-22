import { DateTime } from "luxon";

/**
 * Represents the options used when setting a cookie.
 */
export interface ICookieOptions
{
    /**
     * The domain to which the cookie should be scoped.
     * The default, if not changed, is the host component of the current document location (not including subdomains).
     */
    domain?: string;

    /**
     * The path to which the cookie should be scoped, or undefined to use the default path.
     * The default, if not changed, is the path component of the current document location.
     */
    path?: string;

    /**
     * True if the cookie should only be transmitted over a secure connection.
     * Set this to mitigate the risk of man-in-the-middle attacks stealing a sensitive cookie.
     * The default, if not changed, is false.
     */
    secure?: boolean;

    /**
     * The same site policy to use for the cookie.
     * Set this to mitigate the risk of cross-site-scripting attacks stealing a sensitive cookie.
     * The default, if not changed, is `lax`.
     */
    sameSite?: "none" | "lax" | "strict";

    /**
     * The date at which the value expires, or undefined to set no expiry data.
     */
    expires?: DateTime;
}
