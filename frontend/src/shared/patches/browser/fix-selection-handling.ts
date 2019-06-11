/**
 * Suppress clicks that result from a mouse interaction during which text was selected,
 * and ensure any existing selection is cleared when clicking anywhere on the page.
 */
(() =>
{
    let suppressClick = false;

    // tslint:disable-next-line:no-any
    let clearSelectionTimeout: any;

    document.addEventListener("mousedown", event =>
    {
        // Prevent double and triple clicks, as they cause unwanted selection.
        if (event.composedPath().some(t => (t as HTMLElement).classList && (t as HTMLElement).classList.contains("--suppress-multi-click")))
        {
            if (event.detail > 1)
            {
                event.preventDefault();
            }
        }
    });

    document.addEventListener("mousedown", event =>
    {
        const selection = window.getSelection();

        console.log("capture mousedown", selection);

        if (selection)
        {
            const selectionText = selection.toString();

            if (selectionText === "")
            {
                suppressClick = true;
            }
        }

    }, true);

    document.addEventListener("mouseup", event =>
    {
        const selection = window.getSelection();

        console.log("capture mouseup", selection);

        if (selection)
        {
            const selectionText = selection.toString();

            if (selectionText === "")
            {
                suppressClick = false;
            }
        }

    }, true);

    document.addEventListener("click", event =>
    {
        console.log("capture click", suppressClick);

        if (suppressClick)
        {
            suppressClick = false;
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }

    }, true);

    document.addEventListener("click", event =>
    {
        console.log("click", event.defaultPrevented);

        if (!event.defaultPrevented && clearSelectionTimeout == null)
        {
            clearSelectionTimeout = setTimeout(() =>
            {
                clearSelectionTimeout = undefined;

                const selection = window.getSelection();

                if (selection && selection.type === "Range")
                {
                    selection.removeAllRanges();
                }
            });
        }
    });

})();
