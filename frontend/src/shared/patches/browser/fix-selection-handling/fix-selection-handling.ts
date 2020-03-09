/**
 * Suppress clicks that result from a mouse interaction during which text was selected,
 * and ensure any existing selection is cleared when clicking anywhere on the page.
 */
(() =>
{
    let suppressClick = false;
    let mousedownEvent: MouseEvent | undefined;
    let clearSelectionTimeoutHandle: any;

    document.addEventListener("mousedown", event =>
    {
        // Prevent double and triple clicks, as they cause unwanted selection.
        if (event.composedPath().some((t: HTMLElement | SVGElement) => t.classList && t.classList.contains("suppress-multi-click")))
        {
            if (event.detail > 1)
            {
                event.preventDefault();
            }
        }
    });

    document.addEventListener("mousedown", event =>
    {
        // Reset when a mousedown event occurs.
        suppressClick = false;

        // Cancel the scheduled clearing of the selection, as this may be a multi-click.
        clearTimeout(clearSelectionTimeoutHandle);

        // Store the event, so we can track how far the mouse moves.
        mousedownEvent = event;

    }, true);

    document.addEventListener("mousemove", event =>
    {
        // Only handle mouse move events while the mouse is pressed.
        if (mousedownEvent != null)
        {
            // Has the mouse moved enough for a selection to be made?
            if (Math.abs(mousedownEvent.screenX - event.screenX) > 3 || Math.abs(mousedownEvent.screenY - event.screenY) > 3)
            {
                // Indicate that the click event should be suppressed.
                suppressClick = true;
            }
        }

    }, true);

    document.addEventListener("click", event =>
    {
        mousedownEvent = undefined;

        // Should we suppress the click event?
        if (suppressClick)
        {
            suppressClick = false;

            const selection = window.getSelection();

            // Only suppress the click if a selection exists.
            if (selection != null)
            {
                const selectionText = selection.toString();

                // Only suppress the click if the selection contains text.
                if (selectionText !== "")
                {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                }
            }
        }

    }, true);

    document.addEventListener("click", event =>
    {
        // Don't clear the selection if the event has already been handled.
        if (event.defaultPrevented)
        {
            return;
        }

        // Don't clear selection on multi-click, or if the `Shift` key is pressed.
        if (event.detail > 1 || event.shiftKey)
        {
            return;
        }

        // Don't clear the selection if the element, or one of its ancestors, has a modifier class indicating that selection should be preserved.
        // This may be needed for e.g. buttons that apply formatting to the selected text, or copies the selected text to the clipboard.
        if (event.composedPath().some((t: HTMLElement | SVGElement) => t.classList && t.classList.contains("preserve-selection")))
        {
            return;
        }

        // Schedule the selection to be cleared.
        // tslint:disable-next-line: no-floating-promises
        clearSelectionTimeoutHandle = setTimeout(() =>
        {
            const selection = window.getSelection();

            if (selection != null && selection.type === "Range")
            {
                selection.removeAllRanges();
            }
        }, 50);

    }, true);

})();
