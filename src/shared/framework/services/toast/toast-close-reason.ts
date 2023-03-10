/**
 * Represents the reason a toast is being closed.
 * Note that additional reasons may be defined for specific toasts or scenarios.
 *
 * @example
 *
 * // The user is attempting to close all toasts.
 * "close-all"
 *
 * // The toast is attempting to close automatically after the specified timeout.
 * "close-timeout"
 *
 */
export type ToastCloseReason = "close-all" | "close-timeout" | any;
