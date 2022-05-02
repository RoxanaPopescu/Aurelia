import { DateTime, Settings, Duration } from "luxon";
import humanizeDuration from "humanize-duration";
import { DateTimeRange } from "shared/src/model/general/dateTimeRange";

const localeCode = ENVIRONMENT.locale;
const langCode =
  localeCode.startsWith("da") ? "da" :
  localeCode.startsWith("de") ? "de" :
  localeCode.startsWith("fi") ? "fi" :
  localeCode.startsWith("fr") ? "fr" :
  localeCode.startsWith("it") ? "it" :
  localeCode.startsWith("nl") ? "nl" :
  "en";

var I18n = require("i18n-js");
I18n.defaultLocale = langCode;
I18n.locale = langCode;
I18n.fallbacks = true;

enum Area {
  Consignor,
  Operations,
  Shared
}

/* tslint:disable-next-line: no-any */
type Values = { [name: string]: any };

namespace Area {
  // tslint:disable-next-line:no-any
  export function data(area: Area): { [id: string]: any } {
    // tslint:disable-next-line:switch-default
    switch (area) {
      case Area.Consignor:
        return {
          en: require("./consignor/en.json"),
          da: require("./consignor/da.json")
        };
      case Area.Operations:
        return {
          en: require("./operations/en.json"),
          da: require("./operations/da.json"),
          de: require("./operations/de.json"),
          fi: require("./operations/fi.json"),
          fr: require("./operations/fr.json"),
          it: require("./operations/it.json"),
          nl: require("./operations/nl.json")
        };
      case Area.Shared:
        return {
          en: require("./shared/en.json"),
          da: require("./shared/da.json"),
          de: require("./shared/de.json"),
          fi: require("./shared/fi.json"),
          fr: require("./shared/fr.json"),
          it: require("./shared/it.json"),
          nl: require("./shared/nl.json")
        };
    }
  }
}

export default class Localization {
  private static lastArea?: Area;

  // tslint:disable-next-line:no-any
  private static translationsLoaded: { [id: number]: any } = {};

  private static numberFormats = new Map<
    string | undefined,
    Intl.NumberFormat
  >();
  private static humanizeDuration: (
    duration: number,
    options: DurationFormatOptions
  ) => string;



  // HACK: Needed until https://github.com/moment/luxon/issues/352 is resolved.
  private static dateFormat = new Intl.DateTimeFormat(
    localeCode,
    { ...DateTime.DATE_SHORT, hourCycle: "h24" }
  );
  private static timeFormat = new Intl.DateTimeFormat(
    localeCode,
    { ...DateTime.TIME_SIMPLE, hourCycle: "h24" }
  );
  private static dateTimeFormat = new Intl.DateTimeFormat(
    localeCode,
    { ...DateTime.DATETIME_SHORT, hourCycle: "h24" }
  );
  private static weekdays?: Weekday[];

  private static loadIfNeeded(area: Area) {
    if (Localization.lastArea === undefined || Localization.lastArea !== area) {
      if (!Localization.translationsLoaded[area]) {
        Localization.translationsLoaded[area] = Area.data(area);
      }

      I18n.translations = Localization.translationsLoaded[area];
    }

    Localization.lastArea = area;
  }

  /**
   * The BCP 47 language tag identifying the locale in
   * which text and user interface elements are presented.
   */
  static localeCode: string;

  /**
   * The BCP 47 language tag identifying the locale in
   * which values are formatted and parsed.
   */
  static formatLocaleCode: string;

  private static formatString(text: string, values?: Values): string {
    if (values == null) {
      return text;
    }

    text = text.replace(
      /{\s*(\w+)\s*\|\s*plural((?:\s*:\s*"[^"]*")+)\s*}/g,
      (match, variableName, pluralForms: string) => {
        const pluralFormList = pluralForms
          .split(/\s*:\s*/)
          .slice(1)
          .map(s => s.substring(1, s.length - 1));

        const value = values[variableName] as number;

        // TODO: Use language-specific plural rules.
        const i = value === 1 ? 0 : 1;

        return pluralFormList[i];
      }
    );

    text = text.replace(
      /{(\w+)}/g,
      (match, variableName) => values[variableName]
    );

    return text;
  }

  static consignorValue(key: string, values?: Values) {
    Localization.loadIfNeeded(Area.Consignor);
    return Localization.formatString(I18n.t(key), values);
  }

  static operationsValue(key: string, values?: Values) {
    Localization.loadIfNeeded(Area.Operations);
    return Localization.formatString(I18n.t(key), values);
  }

  static sharedValue(key: string, values?: Values) {
    Localization.loadIfNeeded(Area.Shared);
    return Localization.formatString(I18n.t(key), values);
  }

  static configure() {
    this.localeCode = localeCode;
    this.formatLocaleCode = localeCode;

    Settings.defaultLocale = localeCode;

    this.humanizeDuration = humanizeDuration.humanizer({
      language: localeCode.substring(0, 2),
      units: ["y", "mo", "w", "d", "h", "m"],
      largest: 2,
      round: true
    });
  }

  static formatIntegersAsRanges(numbers: number[], maxGroups?: number): string {
    const list = numbers.slice().sort((a, b) => a - b);
    let result: string[] = [];
    let remaining = 0;

    if (maxGroups != null && maxGroups < 1) {
      throw new Error("Max groups must be larger than 1.");
    }

    for (let i = 0; i < list.length; i++) {
      let start = list[i];
      let end = start;

      for (let j = i + 1; j < list.length; j++) {
        if (list[i] === list[j] || list[i] + 1 === list[j]) {
          i = j;
          end = list[j];
        }
      }

      if (maxGroups != null && result.length >= maxGroups) {
        remaining += 1 + end - start;
      } else {
        result.push(start === end ? `${start}` : `${start}-${end}`);
      }
    }

    if (remaining > 0) {
        return result.join(", ") + Localization.sharedValue("List_and_more").replace("{count}", remaining.toString());
    }

    return result.join(", ");
  }

  static formatNumber(value: number | undefined, decimals: number = 0): string {
    if (value == null) {
      return "";
    }

    const cacheKey = `decimal|${decimals}`;
    let numberFormat = this.numberFormats.get(cacheKey);

    if (numberFormat == null) {
      numberFormat = new Intl.NumberFormat(this.formatLocaleCode, {
        style: "decimal",
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals
      });
      this.numberFormats.set(cacheKey, numberFormat);
    }

    return numberFormat.format(value);
  }

  static formatPercentage(
    value: number | undefined,
    decimals: number = 0
  ): string {
    if (value == null) {
      return "";
    }

    const cacheKey = `percent|${decimals}`;
    let numberFormat = this.numberFormats.get(cacheKey);

    if (numberFormat == null) {
      numberFormat = new Intl.NumberFormat(this.formatLocaleCode, {
        style: "percent",
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
        currencyDisplay: "symbol"
      });
      this.numberFormats.set(cacheKey, numberFormat);
    }

    return numberFormat.format(value);
  }

  static formatCurrency(
    value: number | undefined,
    currencyCode: string,
    decimals?: number
  ): string {
    if (value == null) {
      return "";
    }

    const cacheKey = `currency|${currencyCode}|${decimals}`;
    let numberFormat = this.numberFormats.get(cacheKey);

    if (numberFormat == null) {
      numberFormat = new Intl.NumberFormat(this.formatLocaleCode, {
        style: "currency",
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
        currency: currencyCode,
        currencyDisplay: "symbol"
      });
      this.numberFormats.set(cacheKey, numberFormat);
    }

    return numberFormat.format(value);
  }

  static formatDate(dateTime: DateTime | undefined): string {
    if (dateTime == null) {
      return "";
    }

    return Localization.dateFormat.format(
      DateTime.fromObject(dateTime.toObject()).valueOf()
    );
  }

  static formatTime(dateTime: DateTime | undefined): string {
    if (dateTime == null) {
      return "";
    }

    return Localization.timeFormat.format(
      DateTime.fromObject(dateTime.toObject()).valueOf()
    );
  }

  static formatDateTime(dateTime: DateTime | undefined): string {
    if (dateTime == null) {
      return "";
    }

    return Localization.dateTimeFormat.format(
      DateTime.fromObject(dateTime.toObject()).valueOf()
    );
  }

  static formatVolume(volume: number) {
    return String(volume.toFixed(1)) + " m³";
  }

  static formatWeight(weight: number) {
    if (weight >= 10000) {
      return String((weight / 1000).toFixed(1)) + " tons";
    } else if (weight >= 100) {
      return String(weight.toFixed(0)) + " kg";
    } else {
      return String(weight.toFixed(1)) + " kg";
    }
  }

  static formatDistance(distance: number) {
    if (distance >= 100000) {
      return String((distance / 1000).toFixed(0)) + " km";
    } else if (distance >= 1000) {
      return String((distance / 1000).toFixed(1)) + " km";
    } else if (distance >= 100) {
      return String(distance.toFixed(0)) + " m";
    } else {
      return String(distance.toFixed(1)) + " m";
    }
  }

  static formatDuration(
    duration: Duration | undefined,
    options?: DurationFormatOptions
  ): string {
    if (duration == null) {
      return "";
    }

    const humanizer = options && options.format === "short" ?
      humanizeDuration.humanizer(
        langCode === "da" ?
        {
          language: "shortDk",
          languages: {
            shortDk: {
              y: () => "å",
              mo: () => "må",
              w: () => "u",
              d: () => "d",
              h: () => "t",
              m: () => "m",
              s: () => "s",
              ms: () => "ms"
            }
          }
        } :
        {
          language: "shortEn",
          languages: {
            shortEn: {
              y: () => "y",
              mo: () => "mo",
              w: () => "w",
              d: () => "d",
              h: () => "h",
              m: () => "m",
              s: () => "s",
              ms: () => "ms"
            }
          }
        }) :
      this.humanizeDuration;

    return humanizer(duration.valueOf(), {
      units: ["y", "mo", "w", "d", "h", "m", "s"],
      largest: 2,
      round: true,
      ...options
    });
  }

  static formatDateRange(dateRange: DateTimeRange | undefined): string {
    if (dateRange == null) {
      return "";
    }

    const from = Localization.formatDate(dateRange.from);
    const to = Localization.formatDate(dateRange.to);

    return from === to ? from : `${from} – ${to}`;
  }

  static formatTimeRange(timeRange: DateTimeRange | undefined): string {
    if (timeRange == null) {
      return "";
    }

    const from = Localization.formatTime(timeRange.from);
    const to = Localization.formatTime(timeRange.to);

    return from === to ? from : `${from} – ${to}`;
  }

  static formatDateTimeRange(dateTimeRange: DateTimeRange | undefined): string {
    if (dateTimeRange == null) {
      return "";
    }

    let to: string;
    if (
      dateTimeRange.from &&
      dateTimeRange.to &&
      dateTimeRange.from.hasSame(dateTimeRange.to, "day")
    ) {
      to = Localization.formatTime(dateTimeRange.to);
    } else {
      to = Localization.formatDateTime(dateTimeRange.to);
    }

    const from = Localization.formatDateTime(dateTimeRange.from);

    return from === to ? from : `${from} – ${to}`;
  }

  static weekday(id: number): Weekday | undefined {
    const days = this.allWeekdays.filter(weekday => weekday.number === id);
    if (days.length > 0) {
      return days[0];
    } else {
      return undefined;
    }
  }

  static formatWeekdays(ids: number[]): string {
    const days = this.allWeekdays;

    // If all seven days exist, write mon-sun
    if (ids.length >= 7) {
      return days[0].short + "–" + days[6].short;
    }

    let weekdays: Weekday[] = [];
    for (let id of ids) {
      for (let day of days) {
        if (id === day.number) {
          weekdays.push(day);
        }
      }
    }

    return weekdays.map(weekday => weekday.short).join(", ");
  }

  static weekdaysFromIds(ids: number[]): Weekday[] {
    const days = this.allWeekdays;

    let weekdays: Weekday[] = [];
    for (let id of ids) {
      for (let day of days) {
        if (id === day.number) {
          weekdays.push(day);
        }
      }
    }

    return weekdays;
  }

  static get allWeekdays(): Weekday[] {
    if (this.weekdays === undefined) {
      let days: DateTime[] = [
        DateTime.utc(2018, 1, 1),
        DateTime.utc(2018, 1, 2),
        DateTime.utc(2018, 1, 3),
        DateTime.utc(2018, 1, 4),
        DateTime.utc(2018, 1, 5),
        DateTime.utc(2018, 1, 6),
        DateTime.utc(2018, 1, 7)
      ];

      this.weekdays = days.map(day => {
        return {
          number: day.weekday,
          short: day.weekdayShort,
          long: day.weekdayLong
        };
      });
    }

    return this.weekdays;
  }
}

export interface Weekday {
  number: number;
  short: string;
  long: string;
}

export interface DurationFormatOptions {
  units?: ("y" | "mo" | "w" | "d" | "h" | "m" | "s" | "ms")[];
  largest?: number;
  round?: boolean;
  format?: "long" | "short";
}

Localization.configure();
