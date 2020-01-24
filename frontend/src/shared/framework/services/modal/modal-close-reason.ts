/**
 * Represents the reason a modal is being closed.
 * Note that additional reasons may be defined for specific modals or scenarios.
 *
 * @example
 *
 * // The user is attempting to close all modals by clicked the backdrop.
 * "backdrop-clicked"
 *
 * // The app is attempting to close all modals before navigating.
 * "navigation"
 *
 */
export type ModalCloseReason = "backdrop-clicked" | "navigation" | any;
