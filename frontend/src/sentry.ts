// This file represents an entry point that is separate from the rest of the app, responsible
// for initializing the Sentry error logging service, so it is ready before the app starts.

import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

// Store a reference to an object with the original console methods on the window.
// This allows the logging infrastructure of the app to log things without triggering Sentry.
(window as any)._console = { ...console };

if (ENVIRONMENT.integrations.sentry != null)
{
    // HACK: Ensure unhandled promise rejections are logged in the console.
    // See: https://github.com/getsentry/sentry-javascript/issues/1909#issuecomment-552152624
    window.onunhandledrejection = () => true;

    // Initialize Sentry.
    Sentry.init(
    {
        dsn: ENVIRONMENT.integrations.sentry.dsn,

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
