/**
 * Represents the event that should trigger a validation run.
 * Note that validation can always be run programatically,
 * even if the trigger is `none`.
 */
export type ValidationTrigger = "input" | "change" | "blur" | "none";
