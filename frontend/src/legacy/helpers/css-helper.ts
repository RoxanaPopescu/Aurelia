export function getCssVariable(cssPropertyName: string): string
{
    return getComputedStyle(document.documentElement).getPropertyValue(cssPropertyName);
}
