/**
 * Represents the position of the label, relative to the input.
 */
export type LabelPosition =
    "above" | "before" | "after";

/**
 * Determines whether the input should be focused, based on whether the device supports touch and has a small screen.
 * Use this in controls that provide their own touch interface, where focusing the input would cause the touch keyboard
 * to appear and, on a small screen, obstruct the touch interface.
 * @returns True if the input should be focused, otherwise false.
 */
export function shouldFocusInput(): boolean
{
    const supportsTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    return !supportsTouch || window.innerWidth > 820 || window.innerHeight > 820;
}
