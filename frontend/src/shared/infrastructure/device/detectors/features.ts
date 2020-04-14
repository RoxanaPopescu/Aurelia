/**
 * Returns true if 'sessionStorage' is supported and writable, otherwise false.
 */
export function sessionStorage(): boolean
{
    try
    {
        const key = "__test__";
        window.sessionStorage.setItem(key, "");
        window.sessionStorage.removeItem(key);

        return true;
    }
    catch (error)
    {
        return false;
    }
}

/**
 * Returns true if 'localStorage' is supported and writable, otherwise false.
 */
export function localStorage(): boolean
{
    try
    {
        const key = "__test__";
        window.localStorage.setItem(key, "");
        window.localStorage.removeItem(key);

        return true;
    }
    catch (error)
    {
        return false;
    }
}

/**
 * Returns true if the user agent indicates it prefers a dark color scheme, otherwise false.
 */
export function darkMode(): boolean
{
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
