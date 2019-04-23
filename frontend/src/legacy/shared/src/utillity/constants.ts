export default class Constants {
  public static readonly DATE_FORMAT = "DD.MM.YYYY";
  public static readonly TIME_FORMAT = "HH:mm";
  public static readonly DATE_TIME_FORMAT = "DD/MM/YYYY, HH:mm";

  static get maxCookieDate() {
    let a = new Date();
    a = new Date(a.getTime() + 1000 * 60 * 60 * 24 * 365);

    return a;
  }
}
