/**
 * Represents an event that should trigger a validation run.
 */
export type ValidationTrigger =

    // Events triggered by input changes.
    "input" | "change";

/**
 * Represents the reason a validation run was triggered.
 */
export type ValidationReason =

    // Triggered by input changes.
    ValidationTrigger |

    // Triggered by a dependency.
    "dependency" |

    // Triggered by state changes.
    "attached" | "enabled" |

    // Triggered programmatically.
    undefined;
