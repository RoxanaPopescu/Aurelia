/**
 * Represents the reason a toast is being closed.
 * Note that additional reasons may be defined for specific toasts or scenarios.
 *
 * @example
 *
 * // The user is attempting to close all toasts.
 * "close-all"
 *
 */
export type ToastCloseReason = "close-all" | any;
