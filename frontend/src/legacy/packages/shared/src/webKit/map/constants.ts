export class MapConstants {
  static url(version?: string): string {
    if (version) {
      return (
        // tslint:disable-next-line:max-line-length
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyAHRCItp-wdMJdLeMlI7YvpntwMrgcUbXs&libraries=drawing,geometry&v=" +
        version
      );
    } else {
      // tslint:disable-next-line:max-line-length
      return "https://maps.googleapis.com/maps/api/js?key=AIzaSyAHRCItp-wdMJdLeMlI7YvpntwMrgcUbXs&libraries=drawing,geometry";
    }
  }
}
