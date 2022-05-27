// tslint:disable: no-invalid-this no-unbound-method

import { Duration, DurationOptions } from "luxon";

// TODO: Remove once https://github.com/moment/luxon/issues/880 is fixed.

/**
 * HACK:
 * The regular expression used by the `fromISO` method fails to match if more than 9 fractional digits are specified,
 * although the `toISO` method outputs up to 16 fractional digits. We therefore override the `fromISO` method, as
 * that's unfortunately the only way we can override the regular expression that is the root cause of the bug.
 */
Duration.fromISO = function (text: string, opts?: DurationOptions | undefined): Duration
{
    const [parsed] = parseISODuration(text);

    if (parsed)
    {
        return Duration.fromObject(parsed, opts);
    }
    else
    {
        return Duration.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
    }
};

// The regular expression, with the upper limits on the number of digits removed.
const isoDuration = /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;

// NOTE: The following code is copied from `luxon` without changes.

// @ts-nocheck

function parseISODuration(s: any)
{
    return parse(s, [isoDuration, extractISODuration]);
}

function parse(s: any, ...patterns: any)
{
    if (s == null)
    {
        return [null, null];
    }

    for (const [regex, extractor] of patterns)
    {
        const m = regex.exec(s);
        if (m)
        {
            return extractor(m);
        }
    }

    return [null, null];
}

function extractISODuration(match: any)
{
    const [s, yearStr, monthStr, weekStr, dayStr, hourStr, minuteStr, secondStr, millisecondsStr] =
        match;

    const hasNegativePrefix = s[0] === "-";
    const negativeSeconds = secondStr && secondStr[0] === "-";

    const maybeNegate = (num: any, force = false) =>
        num !== undefined && (force || (num && hasNegativePrefix)) ? -num : num;

    return [
        {
            years: maybeNegate(parseFloating(yearStr)),
            months: maybeNegate(parseFloating(monthStr)),
            weeks: maybeNegate(parseFloating(weekStr)),
            days: maybeNegate(parseFloating(dayStr)),
            hours: maybeNegate(parseFloating(hourStr)),
            minutes: maybeNegate(parseFloating(minuteStr)),
            seconds: maybeNegate(parseFloating(secondStr), secondStr === "-0"),
            milliseconds: maybeNegate(parseMillis(millisecondsStr), negativeSeconds),
        },
    ];
}

function parseFloating(string: any)
{
    if (isUndefined(string) || string === null || string === "")
    {
        return undefined;
    }
    else
    {
        return parseFloat(string);
    }
}

function parseMillis(fraction: any)
{
    // Return undefined (instead of 0) in these cases, where fraction is not set
    if (isUndefined(fraction) || fraction === null || fraction === "")
    {
        return undefined;
    }
    else
    {
        const f = parseFloat("0." + fraction) * 1000;

        return Math.floor(f);
    }
}

function isUndefined(o: any)
{
    return typeof o === "undefined";
}

// @ts-check
