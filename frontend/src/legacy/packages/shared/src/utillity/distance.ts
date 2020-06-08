
export class Distance {

    static distanceBetweenCoordinates(coordinate1, coordinate2): number | undefined {
        if (coordinate1 == null || coordinate2 == null) {
            return;
        }

        var R = 6371; // Radius of the earth in km
        var dLat = Distance.deg2rad(coordinate2.latitude - coordinate1.latitude); // deg2rad below
        var dLon = Distance.deg2rad(coordinate2.longitude - coordinate1.longitude);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(Distance.deg2rad(coordinate1.latitude)) *
            Math.cos(Distance.deg2rad(coordinate2.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return Math.abs(d) * 1000;
    }

    static deg2rad(deg) {
        return deg * (Math.PI / 180);
      }
}
