let isPrerenderStatusCodeSet = false;

/**
 * Sets the status code that should be returned to crawlers.
 */
export function setPrerenderStatusCode(code: number): void
{
    if (!isPrerenderStatusCodeSet)
    {
        isPrerenderStatusCodeSet = true;

        // Set the status code that should be returned to crawlers.
        const prerenderStatusCodeElement = document.head.querySelector('meta[name="prerender-status-code"]') as HTMLMetaElement;
        prerenderStatusCodeElement.setAttribute("content", code.toString());
    }
}
