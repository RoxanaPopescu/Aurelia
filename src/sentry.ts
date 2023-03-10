// This file represents an entry point that is separate from the rest of the app, responsible
// for initializing the Sentry error logging service, so it is ready before the app starts.

import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

// Store a reference to an object with the original console methods on the window.
// This allows the logging infrastructure of the app to log things without triggering Sentry.
(window as any)._console = { ...console };

if (ENVIRONMENT.integrations.sentry != null)
{
    // Initialize Sentry.
    Sentry.init(
    {
        dsn: ENVIRONMENT.integrations.sentry.dsn,

        // Set the traces sample rate.
        tracesSampleRate: 1,

        // Associate entries with the current environment.
        environment: ENVIRONMENT.name,

        // Associate entries with the current release, if any.
        release: ENVIRONMENT.commit ? ENVIRONMENT.commit : undefined,

        // Configure integrations.
        integrations:
        [
            // Capture errors and warnings logged to the console.
            // This is needed to ensure we capture all errors, including those from `aurelia-bootstrapper`.
            new Integrations.CaptureConsole({ levels: ["error", "warning"] })
        ],

        // Attach stack traces to all entries, regardless of their level.
        attachStacktrace: true,

        // Ignore errors that do not represent a problem.
        ignoreErrors:
        [
            "AbortError:",
            "ChunkLoadError:",
            "You have included the Google Maps JavaScript API multiple times",
            "NOT_A_NUMBER",
            "InvalidStateError: Failed to execute 'drawImage' on 'CanvasRenderingContext2D'",
            "Cannot read property 'i' of undefined",
            "Cannot read property 'j' of undefined",
            "undefined is not an object (evaluating 'h.j')",
            "InvalidValueError: at index 0: not a LatLng or LatLngLiteral",
            "InvalidValueError: setPosition: not a LatLng or LatLngLiteral: in property lat: not a number",
            "INVALID_COUNTRY"
        ],

        // Process the entry before it is sent.
        beforeSend: (event, hint) =>
        {
            // Discard irrelevant frames from the stack trace.
            if (event.stacktrace != null && event.stacktrace.frames != null)
            {
                const filteredFrames = event.stacktrace.frames
                    .filter(f => !f.filename ||
                    !(
                        f.filename.includes("/node_modules/@sentry/") ||
                        f.filename.includes("/src/shared/infrastructure/logging/"))
                    );

                if (filteredFrames.length > 0)
                {
                    event.stacktrace.frames = filteredFrames;
                }
            }

            return event;
        }
    });

    // Add tags that should be attached to all entries.
    Sentry.setTags(
    {
        "platform": ENVIRONMENT.platform,
        "locale": ENVIRONMENT.locale,
        "environment": ENVIRONMENT.name
    });

    // Store a reference to Sentry on the window.
    // This allows the logging infrastructure of the app to use Sentry in a loosely coupled way.
    (window as any).Sentry = Sentry;
}
