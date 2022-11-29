import settings from "resources/settings";

// Temporary hacks to support the IKEA demo and topbar test.

const searchParams = new URL(location.href).searchParams;

export const isTopbarEnabled = searchParams.has("theme-enable-topbar");
export const isThemeSpecified = searchParams.has("theme");
export const isNewIkeaThemeSpecified = searchParams.get("theme")?.startsWith("ikea-");

// If the `theme-enable-topbar` query param is specified, enable the `app-topbar`.
if (isTopbarEnabled)
{
    document.documentElement.classList.add("theme-enable-topbar");
}

// If the `theme` query param is specified, remove any environment restrictions on the themes.
if (isThemeSpecified)
{
    settings.app.themes.forEach(theme => delete theme.environments);
}
