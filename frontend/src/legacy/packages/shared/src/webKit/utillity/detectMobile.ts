export default class DetectMobile {
  public static get isMobileView(): boolean {
    if (window.innerWidth < 768) {
      return true;
    } else {
      return false;
    }
  }
}
