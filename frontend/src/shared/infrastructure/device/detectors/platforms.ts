const ua = navigator.userAgent;

export function ios(): boolean
{
    return !/\blike\b.*\b(iPod|iPhone|iPad)\b/.test(ua) && /\b(iPod|iPhone|iPad)\b/.test(ua) && !windowsMobile();
}

export function macos(): boolean
{
    return !/\blike\b.*\bMac OS\b/.test(ua) && /\bMac OS\b/.test(ua) && !windowsMobile();
}

export function android(): boolean
{
    return !/\blike\b.*\bAndroid\b/.test(ua) && /\bAndroid\b/.test(ua) && !windowsMobile();
}

export function windows(): boolean
{
    return !/\blike\b.*\bWindows\b/.test(ua) && /\bWindows\b/.test(ua) && !windowsMobile();
}

export function windowsMobile(): boolean
{
    return !/\blike\b.*\b(IEMobile|Windows Phone)\b/.test(ua) && /\b(IEMobile|Windows Phone)\b/.test(ua);
}
