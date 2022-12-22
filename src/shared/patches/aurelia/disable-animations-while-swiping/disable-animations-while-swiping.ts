import { Container } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

// The timeout handle for the current swipe detection.
let swipeTimeoutHandle: any;

// The horizontal threshold to use when detecting a swipe based on touch.
const xThreshold = 10;

// The start position of the latest touch.
let xStart: number | undefined;
let yStart: number | undefined;

// True when a swipe was detected, otherwise false.
let swiping = false;

// Create a style element, that defines a class that disables animations.

const styleElement = document.createElement("style");
styleElement.innerHTML = ".--disable-animations * { animation: none !important; transition: none !important; }";
document.head.appendChild(styleElement);

// Listen for the `router:navigation:processing` event, and if a swipe was detected,
// apply the class that temporarily disables animations.

Container.instance.get(EventAggregator).subscribe("router:navigation:processing", () =>
{
    if (swiping)
    {
        document.documentElement.classList.add("--disable-animations");
    }
});

// Listen for the `router:navigation:complete` event, and if a swipe was detected,
// remove the class that temporarily disables animations.

Container.instance.get(EventAggregator).subscribe("router:navigation:complete", () =>
{
    if (swiping)
    {
        swiping = false;
        clearTimeout(swipeTimeoutHandle);

        document.documentElement.classList.remove("--disable-animations");
    }
});

// Listen for a single, horizontal `wheel` event, which appears to be the
// only way to detect a swipe gesture in the Safari desktop browser.

window.addEventListener("wheel", event =>
{
    clearTimeout(swipeTimeoutHandle);

    if (!swiping && event.deltaX !== 0 && event.deltaY === 0)
    {
        swiping = true;
        swipeTimeoutHandle = setTimeout(() => swiping = false, 3000);
    }
    else
    {
        swiping = false;
    }
},
{ passive: true, capture: true });

// Listen for `touchstart` and `touchmove` events, which appears to be the
// only way to detect a swipe gesture in the Safari mobile browser.

window.addEventListener("touchstart", event =>
{
    const firstTouch = event.touches[0];

    xStart = firstTouch.clientX;
    yStart = firstTouch.clientY;
},
{ capture: true });

window.addEventListener("touchend", event =>
{
    xStart = undefined;
    yStart = undefined;

    if (swiping)
    {
        clearTimeout(swipeTimeoutHandle);
        swipeTimeoutHandle = setTimeout(() => swiping = false, 3000);
    }
},
{ capture: true });

window.addEventListener("touchmove", event =>
{
    if (xStart == null || yStart == null)
    {
        return;
    }

    const xEnd = event.touches[0].clientX;
    const yEnd = event.touches[0].clientY;

    const xDiff = xStart - xEnd;
    const yDiff = yStart - yEnd;

    if (Math.abs(xDiff) > xThreshold && Math.abs(xDiff) > Math.abs(yDiff))
    {
        swiping = true;
    }
},
{ capture: true });
