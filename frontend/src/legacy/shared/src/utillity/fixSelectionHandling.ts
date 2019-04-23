/**
 * Suppress clicks that result from a mouse interaction during which text was selected,
 * and ensure any existing selection is cleared when clicking anywhere on the page.
 */
(() => {

  let suppressClick = false;

  // tslint:disable-next-line:no-any
  let clearSelectionTimeout: any;

  document.addEventListener("mousedown", event => {
    // Prevent double and triple clicks, as they cause unwanted selection.
    if (event.composedPath().some(t =>
      (t as HTMLElement).classList && (t as HTMLElement).classList.contains("suppress-double-click"))) {
      if (event.detail > 1) {
        event.preventDefault();
      }
    }
  });

  document.addEventListener("mousedown", event => {
    var selection = window.getSelection().toString();

    if (selection === "") {
      suppressClick = true;
    }
  }, true);

  document.addEventListener("mouseup", event => {
    var selection = window.getSelection().toString();

    if (selection === "") {
      suppressClick = false;
    }
  }, true);

  document.addEventListener("click", event => {
    if (suppressClick) {
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }, true);

  document.addEventListener("click", event => {
    if (!event.defaultPrevented) {
      if (clearSelectionTimeout == null) {
        clearSelectionTimeout = setTimeout(() => {
          window.getSelection().removeAllRanges();
        }, 500);
      } else {
        clearTimeout(clearSelectionTimeout);
        clearSelectionTimeout = undefined;
      }
    }
  });

  document.addEventListener("click", event => {
    if (!event.defaultPrevented) {
      clearTimeout(clearSelectionTimeout);
      clearSelectionTimeout = undefined;
    }
  });

})();
