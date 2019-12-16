/**
 * Returns true if 'sessionStorage' is supported and writable.
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
 * Returns true if 'localStorage' is supported and writable.
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
